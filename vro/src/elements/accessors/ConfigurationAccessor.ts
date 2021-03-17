/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
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