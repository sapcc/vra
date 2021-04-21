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
import { CreateDeploymentHttpResponse } from "com.vmware.pscoe.ts.vra.iaas/models/CreateDeploymentHttpResponse";
import { OnboardVmContext } from "../../types/vm/OnboardVmContext";
import { validateResponse } from "../../utils";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

const ONBOARDING_DEPLOYMENT = {
    PREFIX: "Onboarding Deployment - ",
    DESCRIPTION: "Imported Machine into vRA",
    PATH: "/deployment/api/deployments/"
};

export class CreateOnboardingDeployment extends Task {
    private readonly logger: Logger;
    private readonly context: OnboardVmContext;

    constructor(context: OnboardVmContext) {
        super(context);

        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.tasks.vm/CreateOnboardingDeployment");
    }

    prepare() {
        // no-op
    }

    validate() {
        if (!this.context.machinesService) {
            throw Error("'machinesService' is not set!");
        }

        if (!this.context.deploymentService) {
            throw Error("'deploymentService' is not set!");
        }

        if (!this.context.relocationService) {
            throw Error("'relocationService' is not set!");
        }

        if (!this.context.machineId) {
            throw Error("'machineId' is not set!");
        }

        if (!this.context.projectId) {
            throw Error("'projectId' is not set!");
        }

        if (!this.context.planLink) {
            throw Error("'planLink' is not set!");
        }
    }

    execute() {
        const { machinesService, deploymentService, relocationService, machineId, projectId, planLink } = this.context;
        const machineResponse = machinesService.getMachine({
            path_id: machineId
        });

        validateResponse(machineResponse);

        const deploymentName = `${ONBOARDING_DEPLOYMENT.PREFIX}${machineResponse.body.name}`;
        const deploymentResponse: CreateDeploymentHttpResponse = deploymentService.createDeployment({
            body_body: {
                name: deploymentName,
                description: ONBOARDING_DEPLOYMENT.DESCRIPTION,
                projectId
            }
        });

        validateResponse(deploymentResponse);

        this.context.deploymentId = deploymentResponse.body.id;
        
        const consumerDeploymentLink = `${ONBOARDING_DEPLOYMENT.PATH}${this.context.deploymentId}`;
        const responseOnboardingDeployment = relocationService.postRelocationOnboardingDeployment({
            body_body: {
                name: deploymentName,
                consumerDeploymentLink,
                planLink
            }
        });

        validateResponse(responseOnboardingDeployment);

        this.context.deploymentLink = responseOnboardingDeployment.body.documentSelfLink;
        this.context.resourceName = machineResponse.body.name;
    }
}
