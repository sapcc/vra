import { AttachNicToVmContext } from "../nic/AttachNicToVmContext";
import { DetachNicFromVmContext } from "../nic/DetachNicFromVmContext";

/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
export interface UpdateVmContext extends DetachNicFromVmContext, AttachNicToVmContext {
    resourceId: string;
}
