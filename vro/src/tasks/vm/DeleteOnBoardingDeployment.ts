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

export class DeleteOnBoardingDeployment extends Task {
    private readonly logger: Logger;
    private readonly context: OnboardVmContext;

    constructor(context: OnboardVmContext) {
        super(context);

        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.tasks.vm/DeleteOnBoardingDeployment");
    }

    prepare() {
        // no-op
    }

    validate() {
        if (!this.context.deploymentService) {
            throw Error("'deploymentService' is not set!");
        }

        if (!this.context.deploymentId) {
            throw Error("'deploymentId' is not set!");
        }
    }

    execute() {
        const { deploymentService, deploymentId } = this.context;
        const response = deploymentService.deleteDeployment({
            path_id: deploymentId
        });

        validateResponse(response);
    }
}
