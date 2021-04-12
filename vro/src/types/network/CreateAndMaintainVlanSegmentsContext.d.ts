
/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
export interface CreateAndMaintainVlanSegmentsContext {
    segmentName: string;
    transportZoneId: string;
    vlanId: string;
    networkProfileId: string;
    newFabricNetworkId?: string;
    currentFabricNetworkIds: string[];
    timeoutInSeconds: number;
    sleepTimeInSeconds: number;
}
