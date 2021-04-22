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
import { UpdateVmTags } from "../../tasks/vm/UpdateVmTags";
import { WaitForOnBoardingPlan } from "../../tasks/vm/WaitForOnBoardingPlan";
import { OnboardVmContext } from "../../types/vm/OnboardVmContext";

@Workflow({
    name: "Onboarding VM",
    path: "SAP/One Strike/VM"
})
export class OnboardingVmWorkflow {
    public execute(name: string, projectId: string, tags?: string[]): void {
        const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
        const PipelineBuilder = VROES.import("default").from("com.vmware.pscoe.library.pipeline.PipelineBuilder");
        const ExecutionStrategy = VROES.import("default").from("com.vmware.pscoe.library.pipeline.ExecutionStrategy");

        const { timeoutInSeconds, sleepTimeInSeconds, onboardingCloudAccountId } =
                ConfigurationAccessor.loadConfig(PATHS.CONFIG, {} as Config);
                
        const initialContext: OnboardVmContext = {
            projectId,
            onboardingCloudAccountId,
            machineId: name,
            newMachineTags: tags || [],
            timeoutInSeconds,
            sleepTimeInSeconds
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
                WaitForOnBoardingPlan,
                DeleteOnBoardingPlan,
                UpdateVmTags
            )
            .done()
            .build();

        pipeline.process(ExecutionStrategy.ROLLBACK);
    }
}
