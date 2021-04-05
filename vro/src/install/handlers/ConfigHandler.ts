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
        [
            "timeoutInSeconds",
            "sleepTimeInSeconds"
        ].forEach(key => {
            input.readNumber(key)
                .required()
                .config(PATHS.CONFIG)
                .set(key);
        });
    }
};
