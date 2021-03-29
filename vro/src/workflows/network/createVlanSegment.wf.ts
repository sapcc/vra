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
import { VlanSegment } from "../../elements/configs/VLanSegment.conf";
import { CreateVlanSegment } from "../../tasks/network/CreateVlanSegment";
import { GetFabricNetworksFromNetworkProfile } from "../../tasks/network/GetFabricNetworksFromNetworkProfile";
import { TagVlanSegment } from "../../tasks/network/TagVlanSegment";
import { UpdateFabricNetworksInNetworkProfile } from "../../tasks/network/UpdateFabricNetworksInNetworkProfile";
import { WaitForFabricNetwork } from "../../tasks/network/WaitForFabricNetwork";
import { CreateVlanSegmentContext } from "../../types/network/CreateVlanSegmentContext";

@Workflow({
    name: "Create Vlan Segment",
    path: "SAP/One Strike/Network"
})
export class CreateVlanSegmentWorkflow {
    public execute(name: string, vlanId: string): void {
        const logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.workflows.network/CreateVlanSegmentWorkflow");

        const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
        const PipelineBuilder = VROES.import("default").from("com.vmware.pscoe.library.pipeline.PipelineBuilder");
        const ExecutionStrategy = VROES.import("default").from("com.vmware.pscoe.library.pipeline.ExecutionStrategy");
        const { transportZoneId, segmentTagScope, networkProfileId, timeoutInSeconds, sleepTimeInSeconds } =
            ConfigurationAccessor.loadConfig(PATHS.VLAN_SEGMENT, {} as VlanSegment);

        const initialContext: CreateVlanSegmentContext = {
            segmentName: `${name}_${vlanId}`,
            transportZoneId,
            segmentTags: [{
                scope: segmentTagScope,
                tag: name
            }],
            vlanId,
            networkProfileId,
            currentFabricNetworksIds: [],
            timeoutInSeconds,
            sleepTimeInSeconds
        };

        const pipeline = new PipelineBuilder()
            .name("Create Vlan segment")
            .context(initialContext)
            .stage("Create Vlan segment")
            .exec(
                CreateVlanSegment,
                TagVlanSegment
            )
            .done()
            .stage("Attach newly created Vlan segment to network profile")
            .exec(
                WaitForFabricNetwork,
                GetFabricNetworksFromNetworkProfile,
                UpdateFabricNetworksInNetworkProfile
            )
            .done()
            .build();

        pipeline.process(ExecutionStrategy.TERMINATE);
    }
}
