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
import { NsxtClientCreator } from "../../factories/creators/NsxtClientCreator";
import { NsxService } from "../../services/NsxService";
import { GetSegmentFromPoolContext } from "../../types/network/GetSegmentFromPoolContext";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class PatchVlanSegment extends Task {
    private readonly logger: Logger;
    private readonly context: GetSegmentFromPoolContext;
    private nsxService: NsxService;

    constructor(context: GetSegmentFromPoolContext) {
        super(context);

        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.network/TagVlanSegment");
    }

    prepare() {
        this.nsxService = new NsxService(NsxtClientCreator.build());
    }

    validate() {
        if (!this.context.segment) {
            throw Error("'segment' is not set!");
        }

        if (!this.context.segmentName) {
            throw Error("'segmentName' is not set!");
        }

        if (!this.context.vlanId) {
            throw Error("'vlanId' is not set!");
        }

        if (!this.context.segmentTags) {
            throw Error("'segmentTags' is not set!");
        }
    }

    execute() {
        const { segment, segmentName, vlanId, segmentTags } = this.context;

        this.nsxService.patchSegment(segment, {
            display_name: segmentName,
            vlan_ids: vlanId.replace(/[ ]/g, "").split(","),
            tags: segmentTags
        });

        this.logger.info("Vlan segment is patched.");
    }
}
