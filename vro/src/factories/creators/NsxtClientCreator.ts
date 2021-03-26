import { HttpClient } from "com.vmware.pscoe.library.ts.http/HttpClient";
import { PATHS } from "../../constants";
import { ConfigurationAccessor } from "../../elements/accessors/ConfigurationAccessor";
import { Endpoints } from "../../elements/configs/Endpoints.conf";
/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */

export class NsxtClientCreator {

    public static build(): HttpClient {
        const { nsxtRestHost } = ConfigurationAccessor.loadConfig(PATHS.ENDPOINTS_CONFIG, {} as Endpoints);
        if (!nsxtRestHost) {
            throw new Error("NSX-T REST Host is not configured!");
        }

        return new HttpClient(nsxtRestHost);
    }
}
