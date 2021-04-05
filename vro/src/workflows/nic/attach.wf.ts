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
import { CreateNic } from "../../tasks/nic/CreateNic";
import { ReconfigureVmNics } from "../../tasks/nic/ReconfigureVmNetworks";
import { ResolveVcenterVm } from "../../tasks/vm/ResolveVcenterVm";
import { AttachNicToVmContext } from "../../types/nic/AttachNicToVmContext";

@Workflow({
    name: "Attach Nic",
    path: "SAP/One Strike/Nic"
})
export class AttachNicWorkflow {
    public execute(machineId: string, name: string, macAddress: string): void {
        const logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.workflows.nic/AttachNicWorkflow");

        const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
        const PipelineBuilder = VROES.import("default").from("com.vmware.pscoe.library.pipeline.PipelineBuilder");
        const ExecutionStrategy = VROES.import("default").from("com.vmware.pscoe.library.pipeline.ExecutionStrategy");

        const initialContext: AttachNicToVmContext = {
            machineId,
            networkName: name,
            macAddress,
            nics: []
        };

        const pipeline = new PipelineBuilder()
            .name("Attach newly created network to VM")
            .context(initialContext)
            .stage("Create new network")
            .exec(
                CreateNic
            )
            .done()
            .stage("Perform attach network to VM")
            .exec(
                ResolveVcenterVm,
                ReconfigureVmNics
            )
            .done()
            .build();

        pipeline.process(ExecutionStrategy.TERMINATE);
    }
}
