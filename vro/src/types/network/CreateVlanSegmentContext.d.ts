import { Segment } from "com.vmware.pscoe.library.ts.nsxt.policy/models/Segment";
import { Tag } from "com.vmware.pscoe.library.ts.nsxt.policy/models/Tag";

/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
export interface CreateVlanSegmentContext {
    segmentName: string;
    transportZoneId: string;
    vlanId: string;
    segment?: Segment;
    segmentTags: Tag[];
    networkProfileId: string;
    newFabricNetworkId?: string;
    currentFabricNetworkIds: string[];
    timeoutInSeconds: number;
    sleepTimeInSeconds: number;
}
