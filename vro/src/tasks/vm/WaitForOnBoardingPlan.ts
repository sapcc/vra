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
import { stringify, validateResponse } from "../../utils";
import { WaitForOnBoardingHelper } from "./WaitForOnBoardingHelper";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class WaitForOnBoardingPlan extends Task {
    private readonly logger: Logger;
    private readonly context: OnboardVmContext;
    private relocationService: RelocationService;

    constructor(context: OnboardVmContext) {
        super(context);

        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.vm/WaitForOnBoardingPlan");
    }

    prepare() {
        this.relocationService = new RelocationService(VraClientCreator.build());
    }

    validate() {
        if (!this.context.planLink) {
            throw Error("'planLink' is not set!");
        }
    }

    execute() {
        this.logger.info("Waiting for onboarding vm to be complete ...");

        const { planLink, timeoutInSeconds, sleepTimeInSeconds } = this.context;
        const responseExecutedPlan = this.relocationService.postRelocationApiWoExecutePlan({
            body_body: {
                planLink
            }
        });

        validateResponse(responseExecutedPlan);

        const executedPlanLink = responseExecutedPlan.body.documentSelfLink;

        const execution = new WaitForOnBoardingHelper(this.relocationService, executedPlanLink);
        const response = execution.get(timeoutInSeconds, sleepTimeInSeconds);

        validateResponse(response);

        if (response.body.taskInfo.stage === "FAILED") {
            this.logger.error(`Error occurred on plan execution:\n${stringify(response)}`);
            throw new Error("Error occurred on plan execution.");
        }

        this.logger.info(`Onboarding vm completed:\n${stringify(response)}`);
    }
}
