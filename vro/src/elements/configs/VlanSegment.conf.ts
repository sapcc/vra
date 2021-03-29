/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
import { Configuration } from "vrotsc-annotations";

@Configuration({
    name: "Config",
    path: "SAP/One Strike",
    attributes: {
        segmentNameSuffix: "string",
        transportZoneId: "string",
        segmentTagScope: "string",
        segmentTagKey: "string",
        networkProfileId: "string"
    }
})
export class VlanSegment {
    segmentNameSuffix: string;
    transportZoneId: string;
    segmentTagScope: string;
    segmentTagKey: string;
    networkProfileId: string;
}
