import { BaseNetworkContext } from "./BaseNetworkContext";

/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
export interface AttachNetworkToVmContext extends BaseNetworkContext {
    networkName: string;
    macAddress: string;
}
