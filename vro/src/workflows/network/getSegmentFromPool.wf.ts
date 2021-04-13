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
import { SEGMENT_TAG } from "../../constants";
import { GetOldestSegmentFromPool } from "../../tasks/network/GetOldestSegmentFromPool";
import { PatchVlanSegment } from "../../tasks/network/PatchVlanSegment";
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

        const initialContext: GetSegmentFromPoolContext = {
            segmentName: name,
            vlanId,
            segmentTags: [{
                scope: SEGMENT_TAG,
                tag: name
            }],
            poolSize
        };

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
            )
            .done()
            .build();

        pipeline.process(ExecutionStrategy.TERMINATE);
    }
}
