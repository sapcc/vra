/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { VRA_CONFIGURATION_PATH } from "../../constants";

exports = class {
    configure(input: any) {
        [
            "hostname",
            //"domain",
            "username",
            "password",
            // "refreshToken",
            "projectID",
            "orgID"
        ].forEach(key => {
            input.readString(`vra.${key}`)
                .required()
                .config(VRA_CONFIGURATION_PATH)
                .set(key);
        });

        input.readNumber("vra.port")
            .required()
            .config(VRA_CONFIGURATION_PATH)
            .set("port");
    }
};
