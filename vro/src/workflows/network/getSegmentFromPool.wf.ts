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
import { GetOldestSegmentFromPool } from "../../tasks/network/GetOldestSegmentFromPool";
import { PatchVlanSegment } from "../../tasks/network/PatchVlanSegment";
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
        const { networkProfileIds } = ConfigurationAccessor.loadConfig(PATHS.VLAN_SEGMENT_CONFIG, {} as VlanSegment);

        // check to vlan id and transport id return segment
        const initialContext: GetSegmentFromPoolContext = {
            segmentName: name,
            vlanId,
            segmentTags: [{
                scope: SEGMENT_TAG,
                tag: name
            }],
            poolSize,
            // TODO: Use project id (as input) to determine the network profile
            networkProfileId: networkProfileIds[0],
            currentFabricNetworkIds: []
        };

        // TODO: Double check lock
        const pipeline = new PipelineBuilder()
            .name("Get Segment from Pool and Update")
            .context(initialContext)
            .stage("Get Segment from Pool")
            .exec(
                GetOldestSegmentFromPool
            )
            .done()
            .stage("Apply update on segment")
            .exec(
                PatchVlanSegment
                // TODO: search by old name, search by new name or fail
                // GetFabricNetworkByName,
                // GetFabricNetworksFromNetworkProfile,
                // UpdateFabricNetworksInNetworkProfile
                // TODO: GetNetworkId
            )
            .done()
            .build();

        pipeline.process(ExecutionStrategy.TERMINATE);

        outputVraNetworkId = initialContext.vRaNetworkId;
    }
}
