
/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
export interface OnboardVmContext {
    projectId: string;
    onboardingCloudAccountId: string;
    planLink?: string;
    machineId: string;
    deploymentLink?: string;
    resourceName?: string;
    deploymentId?: string;
}
