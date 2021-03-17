/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
import AuthClientService from "com.vmware.pscoe.library.ts.vra.authentication/actions/AuthClientService";
import { Client } from "../IClient";

export class VraClient implements Client {
    public create(): AuthClientService {
        return AuthClientService.withDefaultAuthentication();
    }
}
