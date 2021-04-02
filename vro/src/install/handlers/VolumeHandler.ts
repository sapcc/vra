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
            "tagKey"
        ].forEach(key => {
            input.readString(`volume.${key}`)
                .required()
                .config(PATHS.VOLUME)
                .set(key);
        });
    }
};
