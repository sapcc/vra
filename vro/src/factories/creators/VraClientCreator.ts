/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
import { VraClient } from "../clients/VraClient";
import { Client } from "../IClient";
import { BaseClientCreator } from "./BaseClientCreator";

export class VraClientCreator extends BaseClientCreator {
    public factoryMethod(): Client {
        return new VraClient();
    }
}
