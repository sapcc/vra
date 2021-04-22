/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
import { Workflow } from "vrotsc-annotations";
import { PATHS } from "../../constants";
import { ConfigurationAccessor } from "../../elements/accessors/ConfigurationAccessor";
import { Config } from "../../elements/configs/Config.conf";
import { CreateOnBoardingDeployment } from "../../tasks/vm/CreateOnBoardingDeployment";
import { CreateOnBoardingPlan } from "../../tasks/vm/CreateOnBoardingPlan";
import { CreateOnBoardingResource } from "../../tasks/vm/CreateOnBoardingResource";
import { DeleteOnBoardingDeployment } from "../../tasks/vm/DeleteOnBoardingDeployment";
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

        const { timeoutInSeconds, sleepTimeInSeconds, onboardingCloudAccountId } =
                ConfigurationAccessor.loadConfig(PATHS.CONFIG, {} as Config);
                
        const initialContext: OnboardVmContext = {
            projectId,
            onboardingCloudAccountId,
            machineId: name
        };

        const pipeline = new PipelineBuilder()
            .name("Onboard VM")
            .context(initialContext)
            .stage("Prepare onboarding plan")
            .exec(
                CreateOnBoardingPlan
            )
            .roll(
                DeleteOnBoardingPlan
            )
            .done()
            .stage("Prepare deployment")
            .exec(
                CreateOnBoardingDeployment
            )
            .roll(
                DeleteOnBoardingDeployment
            )
            .done()
            .stage("Prepare VM for onboarding")
            .exec(
                CreateOnBoardingResource
            )
            .done()
            .stage("Execute VM onboarding")
            .exec(
                // WaitForOnboardingPlan
                DeleteOnBoardingPlan
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
