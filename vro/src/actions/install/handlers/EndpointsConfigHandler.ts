import { PATHS } from "../../../constants";
/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */

export class EndpointsConfigHandler {
    /**
     * Empty constructor is required.
     */
    constructor() {}

    public configure(input: any) {
        // NSX-T REST host configuration
        input
            .readRestHost("endpoints.nsxt")
            .required()
            .config(PATHS.ENDPOINTS_CONFIG)
            .set("nsxtRestHost");
    }
}
