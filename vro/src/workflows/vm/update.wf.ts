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
import { PATHS } from "../../constants";
import { ConfigurationAccessor } from "../../elements/accessors/ConfigurationAccessor";
import { Config } from "../../elements/configs/Config.conf";
import { CreateNics } from "../../tasks/nic/CreateNics";
import { DestroyNics } from "../../tasks/nic/DestroyNics";
import { GetCurrentVmNicsMacAddress } from "../../tasks/nic/GetCurrentVmNicsMacAddress";
import { ReconfigureNetworksPorts } from "../../tasks/nic/ReconfigureNetworksPorts";
import { ReconfigureVmNics } from "../../tasks/nic/ReconfigureVmNetworks";
import { PowerOffVm } from "../../tasks/vm/PowerOffVm";
import { PowerOnVm } from "../../tasks/vm/PowerOnVm";
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

        const { timeoutInSeconds, sleepTimeInSeconds } =
                ConfigurationAccessor.loadConfig(PATHS.CONFIG, {} as Config);
                
        const initialContext: UpdateVmContext = {
            resourceId: resourceIds[0],
            machineId: externalIds[0],
            macAddresses: [],
            networkDetails: [],
            nics: [],
            timeoutInSeconds,
            sleepTimeInSeconds
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
                DestroyNics,
                RetrieveVmNetworkDetailsFromResource,
                CreateNics,
                ReconfigureVmNics,
                ReconfigureNetworksPorts
            )
            .done()
            // .stage("Update volumes")
            // .exec(
            //     //
            // )
            // .done()
            .stage("Power on VM")
            .exec(
                // TODO: set state from openstack
                PowerOnVm
            )
            .done()
            .build();

        pipeline.process(ExecutionStrategy.TERMINATE);
    }
}
