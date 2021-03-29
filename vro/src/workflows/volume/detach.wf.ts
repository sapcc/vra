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
import { DeleteMachineDiskParameters } from "com.vmware.pscoe.ts.vra.iaas/models/DeleteMachineDiskParameters";
import { MachinesService } from "com.vmware.pscoe.ts.vra.iaas/services/MachinesService";
import { Workflow } from "vrotsc-annotations";
import { VraClientCreator } from "../../factories/creators/VraClientCreator";
import { stringify, validateResponse } from "../../utils";

@Workflow({
    name: "Detach Volume",
    path: "SAP/One Strike/Volume"
})
export class DetachVolumeWorkflow {
    public execute(volumeId: string, resourceName: string): void {
        const logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.workflows.volume/DetachVolumeWorkflow");

        const vraClientCreator = new VraClientCreator();
        const machinesService = new MachinesService(vraClientCreator.createOperation());
        const response = machinesService.getMachines();

        validateResponse(response);

        const { body: { content } } = response;

        logger.debug(`Machines=${stringify(content)}`);

        const machine = content.filter(machine => machine.name === resourceName)[0];

        logger.debug(`Machine=${stringify(machine)}`);

        if (machine) {
            logger.info(`Detaching disk with id '${volumeId}' from machine with id '${machine.id}'.`);

            const params: DeleteMachineDiskParameters = {
                path_id: machine.id,
                path_id1: volumeId
            };
            const detachedMachineResponse = machinesService.deleteMachineDisk(params);

            validateResponse(detachedMachineResponse);

            logger.info(`Detached disk with id '${volumeId}' from machine with id '${machine.id}'.`);
        }
    }
}
