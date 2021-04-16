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

export class GetOldestSegmentFromPool extends Task {
    private readonly logger: Logger;
    private readonly context: GetSegmentFromPoolContext;
    private segments: Segment[];
    private nsxService: NsxService;

    constructor(context: GetSegmentFromPoolContext) {
        super(context);

        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.network/GetOldestSegmentFromPool");
    }

    prepare() {
        this.nsxService = new NsxService(NsxtClientCreator.build());
        this.segments = this.nsxService.listDefaultVlansPool();

        if (!this.segments.length) {
            const props = new Properties();
            const { poolSize } = this.context;
            
            props.put("poolSize", poolSize);
            AsyncWorkflowExecutor.executeByFqn(PATHS.CREATE_AND_MAINTAIN_VLAN_SEGMENTS_WORKFLOW, props);
            
            throw new Error("Unable to get segment from the pool! Fired Create and Maintain Vlan Segments workflow ...");
        }

        this.logger.info(`Current free segments count: ${this.segments.length}`);
    }

    validate() {
        if (this.context.poolSize <= 0) {
            throw new Error("'poolSize' should be greater that zero.");   
        }
    }

    execute() {
        this.context.segment = [...this.segments].sort((a, b) => a._create_time - b._create_time)[0];

        this.logger.info(`Found segment:\n${stringify(this.context.segment)}`);
    }
}
