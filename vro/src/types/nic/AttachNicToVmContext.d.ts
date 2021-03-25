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
export interface AttachNetworkToVmContext extends BaseNicContext {
    networkName: string;
    macAddress: string;
}
