import { BaseNicContext } from "./BaseNicContext";
import { NicMacAddress } from "./NicMacAddress";

/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
export interface UpdateVmNetworkDetailsContext extends BaseNicContext {
    resourceId: string;
    networkDetails?: NicMacAddress[];
}
