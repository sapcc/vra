import { DeploymentsService } from "com.vmware.pscoe.ts.vra.iaas/services/DeploymentsService";
import { MachinesService } from "com.vmware.pscoe.ts.vra.iaas/services/MachinesService";
import { RelocationService } from "com.vmware.pscoe.ts.vra.relocation/services/RelocationService";

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
    machinesService: MachinesService;
    relocationService: RelocationService;
    deploymentService: DeploymentsService;
    projectId: string;
    planLink?: string;
    machineId: string;
    deploymentLink?: string;
    resourceName?: string;
    deploymentId?: string;
    _features?: {
        trace?: boolean
    };
}
