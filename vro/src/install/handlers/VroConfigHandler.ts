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
        input.readNumber("vroConfig.getPortTimeoutInSeconds")
            .required()
            .config(PATHS.VRO_CONFIG)
            .set("getPortTimeoutInSeconds");

        input.readNumber("vroConfig.getPortSleepTimeInSeconds")
            .required()
            .config(PATHS.VRO_CONFIG)
            .set("getPortSleepTimeInSeconds");
    }
};
