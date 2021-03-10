/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021: SAP
 * %%
 * Create Volume Snapshot
 * #L%
 */
import { Logger } from "com.vmware.pscoe.library.ts.logging/Logger";
import { In, Out, Workflow } from "vrotsc-annotations";
import { VraClientCreator } from "../../factories/creators";
import { BaseContext } from "../../types/BaseContext";
import { stringify, validateResponse } from "../../utils";
import { BlockDevicesService } from "com.vmware.pscoe.ts.vra.iaas/services/BlockDevicesService";

@Workflow({
    name: "Create Volume Snapshot",
    path: "SAP/One Strike/Volume"
})
export class CreateSnapshotOfVolumeWorkflow {

    public execute(@In volumeName: string): void {
        const SingletonContextFactory = System.getModule("com.vmware.pscoe.library.context").SingletonContextFactory();
        const context: BaseContext = SingletonContextFactory.createLazy([
            "com.vmware.pscoe.library.context.workflow"
        ]);
        const logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.workflows.volume/createSnapshot");
        logger.info(`Context=${stringify(context)}`);

        const vraClientCreator = new VraClientCreator();
        const blockDevicesService = new BlockDevicesService(vraClientCreator.createOperation());

        const volumesResponse = blockDevicesService.getBlockDevices();
        const { body: { content } } = volumesResponse;
        logger.debug(`Volumes: ${stringify(content)}`);
        const volume = content.filter(volume => volume.name === volumeName)[0];

        if (!volume) {
            throw Error(`Cannot create volume snapshot! Reason: No volume found with name '${volumeName}'.`)
        }
        
        logger.debug(`Matched volume: ${stringify(volume)}`);

        const volumeId = volume.id;
        const response = blockDevicesService.createFirstClassDiskSnapshot({
            "path_id": volumeId,
            "body_body": {
                "description": "Volume snapshot created by vRA Automation."
            }
        });
        logger.debug(`Create Volume Snapshot response: ${JSON.stringify(response, null, 2)}`);

        validateResponse(response);

        logger.info(`Created a snapshot of volume with id '${volumeId}'.`);
    }
    
}
