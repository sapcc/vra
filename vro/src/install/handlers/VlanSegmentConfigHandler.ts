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
            "segmentNameSuffix",
            "transportZoneId",
            "segmentTagScope",
            "segmentTagKey",
            "networkProfileId"
        ].forEach(key => {
            input.readString(`vlanSegment.${key}`)
                .required()
                .config(PATHS.VLAN_SEGMENT)
                .set(key);
        });
    }
};
