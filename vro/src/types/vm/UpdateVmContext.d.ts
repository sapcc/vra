import { UpdateVmNetworkDetails } from "../../tasks/nic/UpdateVmNetworkDetails";
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
export interface UpdateVmContext extends UpdateVmNetworkDetails {
    networkDetails?: NicMacAddress[];
}
