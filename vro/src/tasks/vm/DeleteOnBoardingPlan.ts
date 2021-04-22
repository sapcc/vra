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

const PLAN_LINK_SEPARATOR = "/";
export class DeleteOnBoardingPlan extends Task {
    private readonly logger: Logger;
    private readonly context: OnboardVmContext;
    private relocationService: RelocationService;

    constructor(context: OnboardVmContext) {
        super(context);

        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.tasks.vm/DeleteOnBoardingPlan");
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
        const { planLink } = this.context;
        const response = this.relocationService.deleteRelocationOnboardingPlanById({
            path_id: planLink.split(PLAN_LINK_SEPARATOR).pop()
        });

        validateResponse(response);
    }
}
