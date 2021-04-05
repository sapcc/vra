/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
import { PATHS } from "../../constants";

exports = class {
    configure(input: any) {
        input.readNumber("nsxtConfig.getPortTimeoutInSeconds")
            .required()
            .config(PATHS.NSXT_CONFIG)
            .set("getPortTimeoutInSeconds");

        input.readNumber("nsxtConfig.getPortSleepTimeInSeconds")
            .required()
            .config(PATHS.NSXT_CONFIG)
            .set("getPortSleepTimeInSeconds");
    }
};
