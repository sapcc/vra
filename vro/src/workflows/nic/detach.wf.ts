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
import { DestroyNics } from "../../tasks/nic/DestroyNics";
import { ResolveVcenterVm } from "../../tasks/vm/ResolveVcenterVm";
import { DetachNicFromVmContext } from "../../types/nic/DetachNicFromVmContext";

@Workflow({
    name: "Detach Nic",
    path: "SAP/One Strike/Nic"
})
export class DetachNicWorkflow {
    public execute(machineId: string, macAddress: string): void {
        const logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.workflows.nic/DetachNicWorkflow");

        const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
        const PipelineBuilder = VROES.import("default").from("com.vmware.pscoe.library.pipeline.PipelineBuilder");
        const ExecutionStrategy = VROES.import("default").from("com.vmware.pscoe.library.pipeline.ExecutionStrategy");

        const initialContext: DetachNicFromVmContext = {
            machineId,
            macAddresses: [macAddress]
        };

        const pipeline = new PipelineBuilder()
            .name("Detach Nic from VM")
            .context(initialContext)
            .stage("Perform detach Nic from VM")
            .exec(
                ResolveVcenterVm,
                DestroyNics
            )
            .done()
            .build();

        pipeline.process(ExecutionStrategy.TERMINATE);
    }
}
