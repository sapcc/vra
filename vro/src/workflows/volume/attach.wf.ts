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
import { AttachMachineDiskParameters } from "com.vmware.pscoe.ts.vra.iaas/models/AttachMachineDiskParameters";
import { DiskAttachmentSpecification } from "com.vmware.pscoe.ts.vra.iaas/models/DiskAttachmentSpecification";
import { MachinesService } from "com.vmware.pscoe.ts.vra.iaas/services/MachinesService";
import { Workflow } from "vrotsc-annotations";
import { VraClientCreator } from "../../factories/creators";
import { BaseContext } from "../../types/BaseContext";
import { stringify, validateResponse } from "../../utils";

@Workflow({
    name: "Attach Standalone Volume",
    path: "SAP/One Strike/Standalone Server"
})
export class AttachWorkflow {
    public execute(volumeId: string, resourceName: string): void {
        const SingletonContextFactory = System.getModule("com.vmware.pscoe.library.context").SingletonContextFactory();

        const context: BaseContext = SingletonContextFactory.createLazy([
            "com.vmware.pscoe.library.context.workflow"
        ]);

        const logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.workflows.volume/attach");
        logger.info(`Context=${stringify(context)}`);

        const vraClientCreator = new VraClientCreator();
        const machinesService = new MachinesService(vraClientCreator.createOperation());
        const response = machinesService.getMachines();

        validateResponse(response);

        const { body: { content } } = response;

        logger.debug(`Machines=${stringify(content)}`);

        const machine = content.filter(machine => machine.name === resourceName)[0];

        logger.debug(`Machine=${stringify(machine)}`);

        if (machine) {
            logger.info(`Attaching disk with id '${volumeId}' to machine with id '${machine.id}'.`);

            const params: AttachMachineDiskParameters = {
                path_id: machine.id,
                body_body: {
                    blockDeviceId: volumeId,
                    description: "Attached volume",
                    name: "Attached volume"
                } as DiskAttachmentSpecification
            };
            const attachedMachineResponse = machinesService.attachMachineDisk(params);

            validateResponse(attachedMachineResponse);

            logger.info(`Attached disk with id '${volumeId}' to machine with id '${machine.id}'.`);
        }
    }
}
