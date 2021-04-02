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
    name: "vRO Config",
    path: "SAP/One Strike",
    attributes: {
        getPortTimeoutInSeconds: {
            type: "number",
            description: `The max interval (in seconds) waiting for retrieving SegmentPort from NSX-T when setting its initial tags on NIC creation.`,
            value: 600
        },
        getPortSleepTimeInSeconds: {
            type: "number",
            description: `The interval (in seconds) between making requests for retrieving SegmentPort from NSX-T when setting its initial tags on NIC creation.`,
            value: 20
        }
    }
})
export class VroConfig {
    getPortTimeoutInSeconds: number
    getPortSleepTimeInSeconds: number
}
