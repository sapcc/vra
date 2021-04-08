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

export class VraClientCreator {
    public static build(): AuthClientService {

        return AuthClientService.withDefaultAuthentication();
    }
}
