/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
import { Logger } from "com.vmware.pscoe.library.ts.logging/Logger";
import { Workflow } from "vrotsc-annotations";
import { CreateNewNetwork } from "../../tasks/network/CreateNewNetwork";
import { ReconfigureVmNetworks } from "../../tasks/network/ReconfigureVmNetworks";
import { ResolveVcenterVm } from "../../tasks/network/ResolveVcenterVm";
import { AttachNetworkToVmContext } from "../../types/network/AttachNetworkToVmContext";

@Workflow({
    name: "Attach Network",
    path: "SAP/One Strike/Network"
})
export class AttachNetworkWorkflow {
    public execute(machineId: string, name: string, macAddress: string): void {
        const logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.workflows.network/attach");

        const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
        const PipelineBuilder = VROES.import("default").from("com.vmware.pscoe.library.pipeline.PipelineBuilder");
        const ExecutionStrategy = VROES.import("default").from("com.vmware.pscoe.library.pipeline.ExecutionStrategy");

        const initialContext: AttachNetworkToVmContext = {
            machineId,
            networkName: name,
            macAddress,
            networks: []
        };

        const pipeline = new PipelineBuilder()
            .name("Attach newly created network to VM")
            .context(initialContext)
            .stage("Create new network")
            .exec(
                CreateNewNetwork
            )
            .done()
            .stage("Perform attach network to VM")
            .exec(
                ResolveVcenterVm,
                ReconfigureVmNetworks
            )
            .done()
            .build();

        pipeline.process(ExecutionStrategy.TERMINATE);
    }
}
