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
import { AsyncWorkflowExecutor } from "com.vmware.pscoe.library.ts.util/AsyncWorkflowExecutor";
import { NetworksService } from "com.vmware.pscoe.ts.vra.iaas/services/NetworksService";
import { PATHS } from "../../constants";
import { VraClientCreator } from "../../factories/creators/VraClientCreator";
import { GetSegmentFromPoolContext } from "../../types/network/GetSegmentFromPoolContext";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class MaintainPoolSize extends Task {
    private readonly logger: Logger;
    private readonly context: GetSegmentFromPoolContext;
    private networksService: NetworksService;

    constructor(context: GetSegmentFromPoolContext) {
        super(context);

        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.network/MaintainPoolSize");
    }

    prepare() {
        this.networksService = new NetworksService(VraClientCreator.build());
    }

    validate() {
        if (!this.context.poolSize) {
            throw Error("'poolSize' is not set!");
        }
    }

    execute() {
        const { poolSize } = this.context;
        const props = new Properties();

        props.put("poolSize", poolSize);

        this.logger.info(`Implicitly call non-blocking ${PATHS.CREATE_AND_MAINTAIN_VLAN_SEGMENTS_WORKFLOW}`);
        AsyncWorkflowExecutor.executeByFqn(PATHS.CREATE_AND_MAINTAIN_VLAN_SEGMENTS_WORKFLOW, props);
    }
}
