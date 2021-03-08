/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { LoggerConfiguration } from "com.vmware.pscoe.library.ts.logging/configuration/LoggerConfiguration";

exports = class {
    configure(input: any) {
        input.readString("pscoeLogLevel")
            .default("debug")
            .then((level: any) => {
                const cfg = new LoggerConfiguration();

                cfg.loadWithDefaults();

                if (cfg.loggers["com.vmware.pscoe"]) {
                    cfg.loggers["com.vmware.pscoe"].level = level;
                }

                cfg.save(cfg);
            });
    }
};
