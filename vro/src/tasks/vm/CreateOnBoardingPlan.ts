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

const ONBOARDING_PLAN = {
    NAME: "SAP One Strike Onboarding",
    DESCRIPTION: "Temporary Plan"
};

export class CreateOnBoardingPlan extends Task {
    private readonly logger: Logger;
    private readonly context: OnboardVmContext;

    constructor(context: OnboardVmContext) {
        super(context);

        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.tasks.vm/CreateOnBoardingPlan");
    }

    prepare() {
        // no-op
    }

    validate() {
        if (!this.context.relocationService) {
            throw Error("'relocationService' is not set!");
        }

        if (!this.context.projectId) {
            throw Error("'projectId' is not set!");
        }
    }

    execute() {
        const { relocationService, projectId } = this.context;
        const response = relocationService.postRelocationOnboardingPlan({
            body_body: {
                name: ONBOARDING_PLAN.NAME,
                description: ONBOARDING_PLAN.DESCRIPTION,
                projectId,
                // TODO: Add to configuration element
                endpointIds: ["435c719f-5972-4876-9cb2-0ad1a6a1c7fd"]
            }
        });

        validateResponse(response);

        this.context.planLink = response.body.documentSelfLink;
    }
}
