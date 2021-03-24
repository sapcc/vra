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
import { GetVmNicsMacAddresses } from "../../tasks/updateNicsMacAddresses/GetVmNicsMacAddresses";
import { PerformUpdateNicsMacAddresses } from "../../tasks/updateNicsMacAddresses/PerformUpdateNicsMacAddresses";
import { ResolveVcenterVM } from "../../tasks/updateNicsMacAddresses/ResolveVcenterVM";
import { UpdateNicsMacAddressesContext } from "../../types/UpdateNicsMacAddressesContext";

@Workflow({
    name: "Update VM NICs MAC addresses",
    path: "SAP/One Strike/VM",
    input: {
        inputProperties: {
            type: "Properties"
        }
    }
})
export class UpdateNicsMacAddressesWorkflow {
    public execute(@In inputProperties: Properties): void {
        const { externalIds, resourceIds } = inputProperties;

        const initialContext: UpdateNicsMacAddressesContext = {
            resourceId: resourceIds[0],
            externalId: externalIds[0]
        };

        const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
        const PipelineBuilder = VROES.import("default").from("com.vmware.pscoe.library.pipeline.PipelineBuilder");
        const ExecutionStrategy = VROES.import("default").from("com.vmware.pscoe.library.pipeline.ExecutionStrategy");
        
        const pipeline = new PipelineBuilder()
            .name("Update Nics MAC addresses")
            .context(initialContext)
            .stage("Get VM NICs MAC addresses")
            .exec(
                GetVmNicsMacAddresses
            )
            .done()
            .stage("Perform Update Nics MAC addresses", (context: UpdateNicsMacAddressesContext) => context.nicsMacAddresses?.length > 0)
            .exec(
                ResolveVcenterVM,
                PerformUpdateNicsMacAddresses
            )
            .done()
            .build();

        pipeline.process(ExecutionStrategy.TERMINATE);
    }
}
