/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
import { Logger } from "com.vmware.pscoe.library.ts.logging/Logger";
import { ConfigElementAccessor } from "com.vmware.pscoe.library.ts.util/ConfigElementAccessor";
import { PATHS } from "../constants";

export class EndpointsConfig extends ConfigElementAccessor {

    private readonly logger: Logger;

    constructor() {
        super(PATHS.ENDPOINTS_CONFIG, true);
        this.logger = Logger.getLogger("EndpointsConfig");
    }

    public get(key, fallback = undefined) {
        const val = super.get(key);
        return typeof val === "undefined" ? fallback : val;
    }

    // NSX-T
    public getNsxtHost(): RESTHost {
        return this.get("nsxtRestHost");
    }

}
