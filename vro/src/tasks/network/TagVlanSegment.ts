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
import { CreateVlanSegmentContext } from "../../types/network/CreateVlanSegmentContext";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class TagVlanSegment extends Task {
    private readonly logger: Logger;
    private readonly context: CreateVlanSegmentContext;
    private nsxService: NsxService;

    constructor(context: CreateVlanSegmentContext) {
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

        if (!this.context.segmentTags) {
            throw Error("'segmentTags' is not set!");
        }
    }

    execute() {
        const { segment, segmentTags } = this.context;
        
        this.nsxService.applyTagToSegment(segment, segmentTags);
        
        this.logger.info("Tagged Vlan segment.");
    }
}
