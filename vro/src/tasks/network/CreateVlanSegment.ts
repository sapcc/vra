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
import { stringify } from "../../utils";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class CreateVlanSegment extends Task {
    private readonly logger: Logger;
    private nsxService: NsxService;

    constructor(context: CreateVlanSegmentContext) {
        super(context);
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.network/CreateVlanSegment");
    }

    prepare() {
        this.nsxService = new NsxService(NsxtClientCreator.build());
    }

    validate() {
        if (!this.context.segmentName) {
            throw Error("'segmentName' is not set!");
        }

        if (!this.context.transportZoneId) {
            throw Error("'transportZoneId' is not set!");
        }

        if (!this.context.vlanId) {
            throw Error("'vlanId' is not set!");
        }
    }

    execute() {
        this.logger.info("Creating Vlan segment ...");
        
        const { segmentName, transportZoneId, vlanId } = this.context;
        const segment = this.nsxService.createVlanSegments(segmentName, transportZoneId, vlanId);
        this.context.segment = segment;
        
        this.logger.info(`Created Vlan segment:\n${stringify(segment)}`);
    }
}
