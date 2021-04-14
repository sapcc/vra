/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
import { PATHS } from "../../constants";

exports = class {
    configure(input: any) {
        [
            "transportZoneId"
        ].forEach(key => {
            input.readString(`vlanSegment.${key}`)
                .required()
                .config(PATHS.VLAN_SEGMENT_CONFIG)
                .set(key);
        });

        input.readRef("vlanSegment.networkProfileIds")
            .required()
            .list()
            .type("string")
            .config(PATHS.VLAN_SEGMENT_CONFIG).set("networkProfileIds");
    }
};
