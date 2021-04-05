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

type NetworkDetail = {
    networkName: string;
    macAddress: string;
    openStackSegmentPortId: string;
}

export interface AttachNicToVmContext extends BaseNicContext {
    networkDetails: NetworkDetail[]
}
