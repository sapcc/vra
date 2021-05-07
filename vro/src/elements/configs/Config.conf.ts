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
        timeoutInSeconds: {
            type: "number",
            description: "The max interval (in seconds) waiting for retrieving request.",
            value: 600
        },
        sleepTimeInSeconds: {
            type: "number",
            description: "The interval (in seconds) between making requests for retrieving request.",
            value: 15
        },
        onboardingCloudAccountId: "string"
    }
})
export class Config {
    timeoutInSeconds: number;
    sleepTimeInSeconds: number;
    onboardingCloudAccountId: string;
}
