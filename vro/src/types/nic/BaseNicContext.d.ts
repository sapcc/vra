import { BaseVmContext } from "../vm/BaseVmContext";

/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
export interface BaseNicContext extends BaseVmContext {
    nics?: VcVirtualDeviceConfigSpec[];
}
