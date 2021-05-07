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
    name: "Endpoints",
    path: "SAP/One Strike",
    attributes: {
        nsxtRestHost: "REST:RESTHost"
    }
})
export class Endpoints {
    nsxtRestHost: RESTHost;
}
