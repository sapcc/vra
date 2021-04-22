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
import { Future } from "com.vmware.pscoe.library.ts.util/Future";
import {
    GetRelocationApiWoExecutePlanByIdHttpResponse
} from "com.vmware.pscoe.ts.vra.relocation/models/GetRelocationApiWoExecutePlanByIdHttpResponse";
import { RelocationService } from "com.vmware.pscoe.ts.vra.relocation/services/RelocationService";
import { stringify, validateResponse } from "../../utils";

const PLAN_LINK_SEPARATOR = "/";

export class WaitForOnBoardingHelper extends Future<GetRelocationApiWoExecutePlanByIdHttpResponse> {
    private readonly logger: Logger;

    constructor(private readonly context: RelocationService, private readonly executedPlanLink: string) {
        super();

        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.vm/WaitForOnBoardingHelper");
    }

    protected checkCompleted(): boolean {
        const response = this.context.getRelocationApiWoExecutePlanById({
            path_id: this.executedPlanLink.split(PLAN_LINK_SEPARATOR).pop()
        });

        validateResponse(response);

        this.logger.debug(`Current Execution Status: ${stringify(response)}`);

        const { body: { taskInfo: { stage } } } = response;

        if (stage === "FINISHED" || stage === "FAILED") {
            this.value = response;
            return true;
        } else {
            return false;
        }
    }
}
