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
    name: "VlanSegment",
    path: "SAP/One Strike",
    attributes: {
        transportZoneId: "string",
        segmentTagScope: "string",
        networkProfileId: "string",
        timeoutInSeconds: "number",
        sleepTimeInSeconds: "number"
    }
})
export class VlanSegment {
    transportZoneId: string;
    segmentTagScope: string;
    networkProfileId: string;
    timeoutInSeconds: number;
    sleepTimeInSeconds: number;
}
