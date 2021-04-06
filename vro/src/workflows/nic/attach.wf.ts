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
import { PATHS } from "../../constants";
import { ConfigurationAccessor } from "../../elements/accessors/ConfigurationAccessor";
import { Config } from "../../elements/configs/Config.conf";
import { CreateNics } from "../../tasks/nic/CreateNics";
import { ReconfigureNetworksPorts } from "../../tasks/nic/ReconfigureNetworksPorts";
import { ReconfigureVmNics } from "../../tasks/nic/ReconfigureVmNetworks";
import { PowerOffVm } from "../../tasks/vm/PowerOffVm";
import { PowerOnVm } from "../../tasks/vm/PowerOnVm";
import { ResolveVcenterVm } from "../../tasks/vm/ResolveVcenterVm";
import { AttachNicToVmContext } from "../../types/nic/AttachNicToVmContext";

@Workflow({
    name: "Attach Nic",
    path: "SAP/One Strike/Nic"
})
export class AttachNicWorkflow {
    public execute(machineId: string, name: string, macAddress: string, openStackSegmentPortId: string): void {
        const logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.workflows.nic/AttachNicWorkflow");

        const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
        const PipelineBuilder = VROES.import("default").from("com.vmware.pscoe.library.pipeline.PipelineBuilder");
        const ExecutionStrategy = VROES.import("default").from("com.vmware.pscoe.library.pipeline.ExecutionStrategy");

        const { timeoutInSeconds, sleepTimeInSeconds } =
                ConfigurationAccessor.loadConfig(PATHS.CONFIG, {} as Config);
                
        const initialContext: AttachNicToVmContext = {
            machineId,
            networkDetails: [{
                networkName: name,
                macAddress,
                networkPortId: openStackSegmentPortId
            }],
            nics: [],
            timeoutInSeconds,
            sleepTimeInSeconds
        };

        const pipeline = new PipelineBuilder()
            .name("Attach newly created network to VM")
            .context(initialContext)
            .stage("Create new network")
            .exec(
                CreateNics
            )
            .done()
            .stage("Perform attach network to VM")
            .exec(
                ResolveVcenterVm,
                PowerOffVm,
                ReconfigureVmNics,
                ReconfigureNetworksPorts,
                // TODO: set state from openstack
                PowerOnVm
            )
            .done()
            .build();

        pipeline.process(ExecutionStrategy.TERMINATE);
    }
}
