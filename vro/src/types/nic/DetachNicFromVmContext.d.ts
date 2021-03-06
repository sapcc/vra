import { BaseNicContext } from "./BaseNicContext";

/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
export interface DetachNicFromVmContext extends BaseNicContext {
    macAddresses: string[];
}
