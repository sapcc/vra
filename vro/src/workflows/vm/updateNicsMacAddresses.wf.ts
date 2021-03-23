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
import { In, Workflow } from "vrotsc-annotations";
import { PerformUpdateNicsMacAddresses } from "../../tasks/PerformUpdateNicsMacAddresses";
import { ResolveResourceCustomProperties } from "../../tasks/ResolveResourceCustomProperties";
import { ResolveVcenterVM } from "../../tasks/ResolveVcenterVM";
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
        const logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.workflows.vm/UpdateNicsMacAddressesWorkflow");
        const { resourceNames, resourceIds, deploymentId } = inputProperties;

        const initialContext: UpdateNicsMacAddressesContext = {
            deploymentId,
            resourceId: resourceIds[0]
        };

        const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
        const PipelineBuilder = VROES.import("default").from("com.vmware.pscoe.library.pipeline.PipelineBuilder");
        const ExecutionStrategy = VROES.import("default").from("com.vmware.pscoe.library.pipeline.ExecutionStrategy");
//, (context: UpdateNicsMacAddressesContext) => context.nicsMacAddresses?.length > 0
        const pipeline = new PipelineBuilder()
            .name(`Update Nics MAC addresses for resource with name '${resourceNames[0]}'.`)
            .context(initialContext)
            .stage("Resolve Resource Custom Properties")
            .exec(
                ResolveResourceCustomProperties
            )
            .done()
            .stage("Perform Update Nics MAC addresses")
            .exec(
                ResolveVcenterVM,
                PerformUpdateNicsMacAddresses
            )
            .done()
            .build();

        pipeline.process(ExecutionStrategy.TERMINATE);
    }
}
