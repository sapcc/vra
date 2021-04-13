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
    segmentName: string;
    vlanId: string;
    segment?: Segment;
    segmentTags: Tag[];
    poolSize: number;
}
