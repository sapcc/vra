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
    name: "Volume",
    path: "SAP/One Strike",
    attributes: {
        tagKey: "string"
    }
})
export class Volume {
    tagKey: string;
}
