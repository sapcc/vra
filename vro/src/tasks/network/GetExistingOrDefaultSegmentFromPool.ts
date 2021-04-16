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
import { Segment } from "com.vmware.pscoe.library.ts.nsxt.policy/models/Segment";
import { AsyncWorkflowExecutor } from "com.vmware.pscoe.library.ts.util/AsyncWorkflowExecutor";
import { PATHS } from "../../constants";
import { NsxtClientCreator } from "../../factories/creators/NsxtClientCreator";
import { NsxService } from "../../services/NsxService";
import { GetSegmentFromPoolContext } from "../../types/network/GetSegmentFromPoolContext";
import { stringify } from "../../utils";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class GetExistingOrDefaultSegmentFromPool extends Task {
    private readonly logger: Logger;
    private readonly context: GetSegmentFromPoolContext;
    private segments: Segment[];
    private nsxService: NsxService;

    constructor(context: GetSegmentFromPoolContext) {
        super(context);

        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.network/GetExistingOrDefaultSegmentFromPool");
    }

    prepare() {
        this.nsxService = new NsxService(NsxtClientCreator.build());
        this.segments = this.nsxService.listDefaultVlansPool();

        if (!this.segments.length) {
            const props = new Properties();
            const { poolSize } = this.context;

            props.put("poolSize", poolSize);
            this.logger.info(`Implicitly call non-blocking ${PATHS.CREATE_AND_MAINTAIN_VLAN_SEGMENTS_WORKFLOW}`);

            AsyncWorkflowExecutor.executeByFqn(PATHS.CREATE_AND_MAINTAIN_VLAN_SEGMENTS_WORKFLOW, props);

            throw new Error("Unable to get segment from the pool!");
        }

        this.logger.info(`Current free segments count: ${this.segments.length}`);
    }

    validate() {
        if (this.context.poolSize <= 0) {
            throw new Error("'poolSize' should be greater that zero.");
        }

        if (!this.context.transportZoneId) {
            throw Error("'transportZoneId' is not set!");
        }

        if (!this.context.vlanId) {
            throw Error("'vlanId' is not set!");
        }

        if (!this.context.segmentName) {
            throw Error("'segmentName' is not set!");
        }

        if (!this.context.segmentTags) {
            throw Error("'segmentTags' is not set!");
        }
    }

    execute() {
        const { vlanId, transportZoneId, segmentName, segmentTags } = this.context;

        this.logger.info("Checking for existing segment ...");

        const segment = this.nsxService.checkForExistingSegment(vlanId, transportZoneId);

        this.logger.debug(`Result for existing segment:\n${stringify(segment)}`);

        if (!segment) {
            this.logger.info("Not found existing segment.");
            this.logger.info("Getting oldest default segment from pool ...");

            this.context.segment = [...this.segments].sort((a, b) => a._create_time - b._create_time)[0];

            this.logger.info(`Found default segment:\n${stringify(this.context.segment)}`);

            this.nsxService.patchSegment(this.context.segment, {
                display_name: segmentName,
                vlan_ids: vlanId.replace(/[ ]/g, "").split(","),
                tags: segmentTags
            });

            this.logger.info("The segment is patched.");
        } else {
            this.context.hasExistingSegment = true;
            this.context.segment = segment;
            this.logger.info(`Found existing segment:\n${stringify(segment)}`);
        }
    }
}
