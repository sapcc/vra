import { DetachNicFromVmContext } from "../nic/DetachNicFromVmContext";
import { NicMacAddress } from "../nic/NicMacAddress";

/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
export interface UpdateVmContext extends DetachNicFromVmContext {
    resourceId: string;
    networkDetails?: NicMacAddress[];
}
