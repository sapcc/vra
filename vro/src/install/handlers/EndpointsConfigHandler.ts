/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
import { PATHS, VRA_CONFIGURATION_PATH } from "../../constants";

exports = class {
    configure(input: any) {
        // vRA
        [
            "hostname",
            //"domain",
            "username",
            "password",
            // "refreshToken",
            "projectID",
            "orgID"
        ].forEach(key => {
            input.readString(`endpoints.vra.${key}`)
                .required()
                .config(VRA_CONFIGURATION_PATH)
                .set(key);
        });

        input.readNumber("endpoints.vra.port")
            .required()
            .config(VRA_CONFIGURATION_PATH)
            .set("port");

        input.readBoolean("endpoints.vra.isPersistent")
            .required()
            .config(VRA_CONFIGURATION_PATH)
            .set("isPersistent");

        // NSX-T REST host configuration
        input.readRestHost("endpoints.nsxt")
            .required()
            .config(PATHS.ENDPOINTS_CONFIG)
            .set("nsxtRestHost");

        // vCenter REST host configuration
        [
            "name",
            "url",
            "authUserName",
            "authPassword"
        ].forEach(key => {
            input.readString(`endpoints.vcenter.${key}`)
                .required()
                .config(PATHS.ENDPOINTS_VCENTER_CONFIG)
                .set(key);
        });
    }
};
