/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { ConfigElementAccessor } from "com.vmware.pscoe.library.ts.util/ConfigElementAccessor";
import { PATHS } from "../../constants";
import { Config } from "../configs/Config.conf";

export class ConfigurationAccessor {
    private static load<T>(ce: ConfigElementAccessor, config: T): T {
        ce.getElement().attributes.forEach((attr: any) => {
            config[attr.name] = attr.value;
        });
        
        return config;
    }
    
    public static loadConfig() {
        return ConfigurationAccessor.load(
            new ConfigElementAccessor(PATHS.CONFIG),
            {} as Config
        );
    }
}
