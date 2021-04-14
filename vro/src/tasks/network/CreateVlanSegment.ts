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
import { DEFAULT_SEGMENT_TAG } from "../../constants";
import { NsxtClientCreator } from "../../factories/creators/NsxtClientCreator";
import { NsxService } from "../../services/NsxService";
import { CreateAndMaintainVlanSegmentsContext } from "../../types/network/CreateAndMaintainVlanSegmentsContext";
import { stringify } from "../../utils";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class CreateVlanSegment extends Task {
    private readonly logger: Logger;
    private readonly context: CreateAndMaintainVlanSegmentsContext;
    private nsxService: NsxService;

    constructor(context: CreateAndMaintainVlanSegmentsContext) {
        super(context);

        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.network/CreateVlanSegment");
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
        this.logger.info("Creating Vlan segment ...");

        const { topUp, transportZoneId, vlanId } = this.context;
        const generatedSegmentNames = [];

        for (let i = 0; i < topUp; i++) {
            generatedSegmentNames.push(`${DEFAULT_SEGMENT_TAG}-${System.nextUUID()}`);
        }

        generatedSegmentNames
            .forEach(name => {
                this.logger.info(`Creating segment with name '${name}'.`);

                const segment = this.nsxService.createVlanSegments(name, transportZoneId, vlanId);

                this.logger.info(`Created Vlan segment:\n${stringify(segment)}`);
            });
    }
}
