/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { HttpClient } from "com.vmware.pscoe.library.ts.http/HttpClient";

export interface Client {
    create(): HttpClient 
}
