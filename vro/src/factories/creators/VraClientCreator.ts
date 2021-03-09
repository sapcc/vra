/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 TODO: Enter Organization name
 * %%
 * TODO: Define header text
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
