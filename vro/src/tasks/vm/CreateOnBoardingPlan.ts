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
import { RelocationService } from "com.vmware.pscoe.ts.vra.relocation/services/RelocationService";
import { VraClientCreator } from "../../factories/creators/VraClientCreator";
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
    private relocationService: RelocationService;

    constructor(context: OnboardVmContext) {
        super(context);

        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.tasks.vm/CreateOnBoardingPlan");
    }

    prepare() {
        this.relocationService = new RelocationService(VraClientCreator.build());
    }

    validate() {
        if (!this.context.projectId) {
            throw Error("'projectId' is not set!");
        }

        if (!this.context.onboardingCloudAccountId) {
            throw Error("'onboardingCloudAccountId' is not set!");
        }
    }

    execute() {
        const { projectId, onboardingCloudAccountId } = this.context;
        const response = this.relocationService.postRelocationOnboardingPlan({
            body_body: {
                name: ONBOARDING_PLAN.NAME,
                description: ONBOARDING_PLAN.DESCRIPTION,
                projectId,
                endpointIds: [onboardingCloudAccountId]
            }
        });

        validateResponse(response);

        this.context.planLink = response.body.documentSelfLink;
    }
}
