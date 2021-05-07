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
import { Out, Workflow } from "vrotsc-annotations";
import { PATHS, SEGMENT_TAG } from "../../constants";
import { ConfigurationAccessor } from "../../elements/accessors/ConfigurationAccessor";
import { VlanSegment } from "../../elements/configs/VlanSegment.conf";
import { GetExistingOrDefaultSegmentFromPool } from "../../tasks/network/GetExistingOrDefaultSegmentFromPool";
import { GetFabricNetworkByNameAndCloudAccount } from "../../tasks/network/GetFabricNetworkByNameAndCloudAccount";
import { GetFabricNetworksFromNetworkProfile } from "../../tasks/network/GetFabricNetworksFromNetworkProfile";
import { GetNetworkId } from "../../tasks/network/GetNetworkId";
import { MaintainPoolSize } from "../../tasks/network/MaintainPoolSize";
import { UpdateFabricNetworksInNetworkProfile } from "../../tasks/network/UpdateFabricNetworksInNetworkProfile";
import { GetSegmentFromPoolContext } from "../../types/network/GetSegmentFromPoolContext";

@Workflow({
    name: "Get Segment from Pool",
    path: "SAP/One Strike/Network",
    output: {
        outputVraNetworkId: {
            type: "string"
        }
    }
})
export class GetSegmentFromPoolWorkflow {
    public execute(poolSize: number, name: string, vlanId: string, @Out outputVraNetworkId: string): void {
        const logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.workflows.network/GetSegmentFromPoolWorkflow");

        const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
        const PipelineBuilder = VROES.import("default").from("com.vmware.pscoe.library.pipeline.PipelineBuilder");
        const ExecutionStrategy = VROES.import("default").from("com.vmware.pscoe.library.pipeline.ExecutionStrategy");
        const { networkProfileIds, cloudAccountId, transportZoneId } =
            ConfigurationAccessor.loadConfig(PATHS.VLAN_SEGMENT_CONFIG, {} as VlanSegment);

        const initialContext: GetSegmentFromPoolContext = {
            vlanId,
            transportZoneId,
            segment: null,
            segmentName: name,
            segmentTags: [{
                scope: SEGMENT_TAG,
                tag: name
            }],
            poolSize,
            cloudAccountId,
            // TODO: Use project id (as input) to determine the network profile
            networkProfileId: networkProfileIds[0],
            currentFabricNetworkIds: [],
            hasExistingSegment: false
        };

        const pipeline = new PipelineBuilder()
            .name("Get Segment from Pool")
            .context(initialContext)
            .stage("Prepare segment")
            .exec(
                GetExistingOrDefaultSegmentFromPool
            )
            .done()
            .stage("Update segment", (context: GetSegmentFromPoolContext) => !context.hasExistingSegment)
            .exec(
                GetFabricNetworkByNameAndCloudAccount,
                GetFabricNetworksFromNetworkProfile,
                UpdateFabricNetworksInNetworkProfile
            )
            .done()
            .stage("Post actions")
            .exec(
                MaintainPoolSize,
                GetNetworkId
            )
            .done()
            .build();

        pipeline.process(ExecutionStrategy.TERMINATE);

        outputVraNetworkId = initialContext.vRaNetworkId;
    }
}
