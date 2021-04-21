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
import { OnboardVmContext } from "../../types/vm/OnboardVmContext";
import { validateResponse } from "../../utils";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class DeleteOnBoardingPlan extends Task {
    private readonly logger: Logger;
    private readonly context: OnboardVmContext;

    constructor(context: OnboardVmContext) {
        super(context);

        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.tasks.vm/DeleteOnBoardingPlan");
    }

    prepare() {
        // no-op
    }

    validate() {
        if (!this.context.relocationService) {
            throw Error("'relocationService' is not set!");
        }

        if (!this.context.planLink) {
            throw Error("'planLink' is not set!");
        }
    }

    execute() {
        const { relocationService, planLink } = this.context;
        const response = relocationService.deleteRelocationApiWoExecutePlanById({
            path_id: planLink
        });

        validateResponse(response);
    }
}
