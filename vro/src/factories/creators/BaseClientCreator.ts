/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
import { HttpClient } from "com.vmware.pscoe.library.ts.http/HttpClient";
import { Client } from "../IClient";

export abstract class BaseClientCreator {
    public abstract factoryMethod(): Client;

    public createOperation(): HttpClient {
        const client = this.factoryMethod();
        
        return client.create();
    }
}
