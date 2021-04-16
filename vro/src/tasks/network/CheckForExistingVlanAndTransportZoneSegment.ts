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
import { stringify } from "../../utils";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class CheckForExistingVlanAndTransportZoneSegment extends Task {
    private readonly logger: Logger;
    private readonly context: GetSegmentFromPoolContext;
    private nsxService: NsxService;

    constructor(context: GetSegmentFromPoolContext) {
        super(context);

        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.network/CheckForExistingVlanAndTransportZoneSegment");
    }

    prepare() {
        this.nsxService = new NsxService(NsxtClientCreator.build());
    }

    validate() {
        if (!this.context.transportZoneId) {
            throw Error("'transportZoneId' is not set!");
        }

        if (!this.context.vlanId) {
            throw Error("'vlanId' is not set!");
        }
    }

    execute() {
        const { vlanId, transportZoneId } = this.context;
        const segment = this.nsxService.checkForExistingSegment(vlanId, transportZoneId);

        this.logger.debug(`Result for existing segment:\n${stringify(segment)}`);

        if (segment !== null) {
            this.context.hasExistingSegment = true;
            this.context.segment = segment;
            this.logger.info(`Found existing segment:\n${stringify(segment)}`);
        }
    }
}
