/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import AuthClientService from "com.vmware.pscoe.library.ts.vra.authentication/actions/AuthClientService";
import { Client } from "../IClient";

export class VraClient implements Client {
    public create(): AuthClientService {
        return AuthClientService.withDefaultAuthentication();
    }
}
