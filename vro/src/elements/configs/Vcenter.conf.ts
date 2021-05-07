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
    name: "Vcenter",
    path: "SAP/One Strike",
    attributes: {
        name: "string",
        url: "string",
        authUserName: "string",
        authPassword: "SecureString"
    }
})
export class Vcenter {
    name: string;
    url: string;
    authUserName: string;
    authPassword: SecureString;
}
