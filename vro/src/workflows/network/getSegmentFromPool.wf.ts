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
import { PATHS, SEGMENT_TAG } from "../../constants";
import { ConfigurationAccessor } from "../../elements/accessors/ConfigurationAccessor";
import { Config } from "../../elements/configs/Config.conf";
import { VlanSegment } from "../../elements/configs/VlanSegment.conf";
import { TagVlanSegment } from "../../tasks/network/TagVlanSegment";
import { GetSegmentFromPoolContext } from "../../types/network/GetSegmentFromPoolContext";

@Workflow({
    name: "Get Segment from Pool",
    path: "SAP/One Strike/Network"
})
export class GetSegmentFromPoolWorkflow {
    public execute(poolSize: number, name: string, vlanId: string): void {
        const logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.workflows.network/GetSegmentFromPoolWorkflow");

        const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
        const PipelineBuilder = VROES.import("default").from("com.vmware.pscoe.library.pipeline.PipelineBuilder");
        const ExecutionStrategy = VROES.import("default").from("com.vmware.pscoe.library.pipeline.ExecutionStrategy");
        const { timeoutInSeconds, sleepTimeInSeconds } =
            ConfigurationAccessor.loadConfig(PATHS.CONFIG, {} as Config);
        const { transportZoneId, networkProfileId } =
            ConfigurationAccessor.loadConfig(PATHS.VLAN_SEGMENT, {} as VlanSegment);

        const initialContext: GetSegmentFromPoolContext = {
            segmentName: name,
            // TODO: get oldest segment from pool, if not present fire create and maintain
            segment: null,
            vlanId,
            segmentTags: [{
                scope: SEGMENT_TAG,
                tag: name
            }]
        };

        const pipeline = new PipelineBuilder()
            .name("Get Segment from Pool")
            .context(initialContext)
            .stage("Tag vlan segment")
            .exec(
                // RenameVlanSegment
                TagVlanSegment
            )
            .done()
            .build();

        pipeline.process(ExecutionStrategy.TERMINATE);
    }
}
