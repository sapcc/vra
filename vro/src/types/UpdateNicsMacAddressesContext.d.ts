import { NicsMacAddress } from "./NicsMacAddress";

/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
export interface UpdateNicsMacAddressesContext {
    deploymentId: string;
    resourceId: string;
    nicsMacAddresses?: NicsMacAddress[];
    instanceUUID?: string;
    vcVM?: VcVirtualMachine;
}
