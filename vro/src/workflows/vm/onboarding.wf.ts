/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
import { DeploymentsService } from "com.vmware.pscoe.ts.vra.iaas/services/DeploymentsService";
import { MachinesService } from "com.vmware.pscoe.ts.vra.iaas/services/MachinesService";
import { RelocationService } from "com.vmware.pscoe.ts.vra.relocation/services/RelocationService";
import { Workflow } from "vrotsc-annotations";
import { VraClientCreator } from "../../factories/creators/VraClientCreator";
import { CreateOnboardingDeployment } from "../../tasks/vm/CreateOnboardingDeployment";
import { CreateOnBoardingPlan } from "../../tasks/vm/CreateOnBoardingPlan";
import { CreateOnboardingResource } from "../../tasks/vm/CreateOnboardingResource";
import { DeleteOnBoardingPlan } from "../../tasks/vm/DeleteOnBoardingPlan";
import { OnboardVmContext } from "../../types/vm/OnboardVmContext";

@Workflow({
    name: "Onboarding VM",
    path: "SAP/One Strike/VM"
})
export class OnboardingVmWorkflow {
    public execute(name: string, projectId: string): void {
        const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
        const PipelineBuilder = VROES.import("default").from("com.vmware.pscoe.library.pipeline.PipelineBuilder");
        const ExecutionStrategy = VROES.import("default").from("com.vmware.pscoe.library.pipeline.ExecutionStrategy");

        const vraClient = VraClientCreator.build();

        const initialContext: OnboardVmContext = {
            // TODO: Remove services
            machinesService: new MachinesService(vraClient),
            relocationService: new RelocationService(vraClient),
            deploymentService: new DeploymentsService(vraClient),
            projectId,
            machineId: name,
            // TODO: Remove this
            _features: {
                trace: false
            }
        };

        const pipeline = new PipelineBuilder()
            .name("Onboard VM")
            .context(initialContext)
            .stage("Prepare VM for onboarding")
            .exec(
                CreateOnBoardingPlan,
                CreateOnboardingDeployment,
                CreateOnboardingResource
            )
            .done()
            .stage("Execute VM onboarding")
            .exec(
                // WaitForOnboardingPlan
                DeleteOnBoardingPlan
            )
            .roll(
                DeleteOnBoardingPlan
                // DeleteOnBoardingDeployment
            )
            .done()
            .build();

        pipeline.process(ExecutionStrategy.ROLLBACK);

        // TODO: Update tags?
        // const inputTags = { applicationVendor, wbsCode, costCenter, platformOwner, domain, numbering, serverType };
        // const newTags = machine.tags || [];
        // for (let key in inputTags) {
        //     newTags.push({ key, value: inputTags[key] });
        // }
        // machinesService.updateMachine({ path_id: machineId, body_body: { tags: newTags } });

        // TODO: WaitForOnboardingPlan
        // const executionResult = relocationService.executeOnboardingPlanAndWaitToFinish(planLink);

        // if (executionResult == "FAILED") {
        //     relocationService.deleteIaasDeployment(deploymentId);
        //     throw Error("Onboarding Plan Execution has failed, Previous operations were rolled back!");
        // }

    }
}
