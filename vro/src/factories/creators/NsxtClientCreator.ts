import { HttpClient } from "com.vmware.pscoe.library.ts.http/HttpClient";
import { HttpClientVroBuilder } from "com.vmware.pscoe.library.ts.http/HttpClientBuilder";
import { EndpointsConfig } from "../EndpointsConfig";
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
        const config = new EndpointsConfig();

        const nsxtRestHost = config.getNsxtHost();
        if (!nsxtRestHost) {
            throw new Error(`NSX-T REST Host is not configured!`);
        }

        return new HttpClient(nsxtRestHost);
    }
}
