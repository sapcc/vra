/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
import { In, Workflow } from "vrotsc-annotations";
import { DestroyNic } from "../../tasks/nic/DestroyNic";
import { GetCurrentVmNicsMacAddress } from "../../tasks/nic/GetCurrentVmNicsMacAddress";
import { ReconfigureVmNics } from "../../tasks/nic/ReconfigureVmNetworks";
import { UpdateVmNetworkDetails } from "../../tasks/nic/UpdateVmNetworkDetails";
import { PowerOffVm } from "../../tasks/vm/PowerOffVm";
import { ResolveVcenterVm } from "../../tasks/vm/ResolveVcenterVm";
import { RetrieveVmNetworkDetailsFromResource } from "../../tasks/vm/RetrieveVmNetworkDetailsFromResource";
import { UpdateVmContext } from "../../types/vm/UpdateVmContext";

@Workflow({
    name: "Update VM",
    path: "SAP/One Strike/VM",
    input: {
        inputProperties: {
            type: "Properties"
        }
    }
})
export class UpdateVmWorkflow {
    public execute(@In inputProperties: Properties): void {
        const { externalIds, resourceIds } = inputProperties;

        const initialContext: UpdateVmContext = {
            resourceId: resourceIds[0],
            machineId: externalIds[0],
            macAddresses: []
        };

        const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
        const PipelineBuilder = VROES.import("default").from("com.vmware.pscoe.library.pipeline.PipelineBuilder");
        const ExecutionStrategy = VROES.import("default").from("com.vmware.pscoe.library.pipeline.ExecutionStrategy");

        const pipeline = new PipelineBuilder()
            .name("Update VM")
            .context(initialContext)
            .stage("Power off VM")
            .exec(
                ResolveVcenterVm,
                PowerOffVm
            )
            .done()
            .stage("Update VM network details")
            .exec(
                GetCurrentVmNicsMacAddress,
                DestroyNic,
                RetrieveVmNetworkDetailsFromResource,
                UpdateVmNetworkDetails,
                ReconfigureVmNics
            )
            .done()
            // .stage("Update volumes")
            // .exec(
            //     //
            // )
            // .done()
            .build();

        pipeline.process(ExecutionStrategy.TERMINATE);
    }
}
