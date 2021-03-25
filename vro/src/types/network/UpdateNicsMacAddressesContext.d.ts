import { BaseNetworkContext } from "./BaseNetworkContext";
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
export interface UpdateNicsMacAddressesContext extends BaseNetworkContext {
    resourceId: string;
    nicsMacAddresses?: NicsMacAddress[];
}
