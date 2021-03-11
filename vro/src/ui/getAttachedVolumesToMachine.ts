/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { Logger } from "com.vmware.pscoe.library.ts.logging/Logger";
import { GetMachineDisksParameters } from "com.vmware.pscoe.ts.vra.iaas/models/GetMachineDisksParameters";
import { MachinesService } from "com.vmware.pscoe.ts.vra.iaas/services/MachinesService";
import { VraClientCreator } from "../factories/creators/VraClientCreator";
import { stringify, validateResponse } from "../utils";

/**
 * Makes a call to attached volumes to machine
 * @param machineId {string} machine id
 * @return {Properties} return all attached volumes to machine
 */
(function (machineId: string) {
    try {
        const vraClientCreator = new VraClientCreator();

        const machineService = new MachinesService(vraClientCreator.createOperation());
        const params: GetMachineDisksParameters = {
            path_id: machineId
        };
        const response = machineService.getMachineDisks(params);

        validateResponse(response);

        const { body: { content: blockDevices } } = response;

        const result = new Properties();

        blockDevices.forEach(({ id, name }) => {
            result.put(id, name);
        });

        return result;
    } catch (error) {
        const logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.ui/getAttachedVolumesToMachine");
        logger.error(`Unable to get attached volumes to machine with '${machineId}'. Error:\n${stringify(error)}.`);

        return new Properties();
    }
});
