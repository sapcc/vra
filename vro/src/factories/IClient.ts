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

export interface Client {
    create(): HttpClient 
}
