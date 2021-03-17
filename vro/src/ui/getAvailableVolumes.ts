/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
import { Logger } from "com.vmware.pscoe.library.ts.logging/Logger";
import { BlockDevicesService } from "com.vmware.pscoe.ts.vra.iaas/services/BlockDevicesService";
import { VraClientCreator } from "../factories/creators/VraClientCreator";
import { stringify, validateResponse } from "../utils";

/**
 * Makes a call to get available volumes
 * @return {Properties} return all available volumes
 */
(function () {
    try {
        const vraClientCreator = new VraClientCreator();

        const blockDevicesService = new BlockDevicesService(vraClientCreator.createOperation());
        const response = blockDevicesService.getBlockDevices();

        validateResponse(response);

        const { body: { content: blockDevices } } = response;

        const result = new Properties();

        blockDevices.filter(({ status }) => status === "AVAILABLE").forEach(({ id, name }) => {
            result.put(id, name);
        });

        return result;
    } catch (error) {
        const logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.ui/getAvailableVolumes");
        logger.error(`Unable to get available volumes. Error:\n${stringify(error)}.`);

        return new Properties();
    }
});
