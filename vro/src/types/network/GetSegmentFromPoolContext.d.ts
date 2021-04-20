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
export interface GetSegmentFromPoolContext {
    vlanId: string;
    transportZoneId: string;
    segment: Segment;
    segmentName: string;
    segmentTags: Tag[];
    poolSize: number;
    cloudAccountId: string;
    networkProfileId: string;
    newFabricNetworkId?: string;
    currentFabricNetworkIds: string[];
    vRaNetworkId?: string;
    hasExistingSegment: boolean;
}
