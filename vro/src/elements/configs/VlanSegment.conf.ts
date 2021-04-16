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
        networkProfileIds: "Array/string",
        cloudAccountId: "string"

    }
})
export class VlanSegment {
    transportZoneId: string;
    networkProfileIds: string[];
    cloudAccountId: string;
}
