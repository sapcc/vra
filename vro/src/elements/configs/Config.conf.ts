/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
import { Configuration } from "vrotsc-annotations";

@Configuration({
    name: "Config",
    path: "SAP/One Strike",
    attributes: {
        timeoutInSeconds: "number",
        sleepTimeInSeconds: "number"
    }
})
export class Config {
    timeoutInSeconds: number;
    sleepTimeInSeconds: number;
}
