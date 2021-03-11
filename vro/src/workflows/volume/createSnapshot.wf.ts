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
import { In, Workflow } from "vrotsc-annotations";
import { VraClientCreator } from "../../factories/creators/VraClientCreator";
import { BaseContext } from "../../types/BaseContext";
import { stringify, validateResponse } from "../../utils";
import { BlockDevicesService } from "com.vmware.pscoe.ts.vra.iaas/services/BlockDevicesService";
import { DeploymentsService } from "com.vmware.pscoe.ts.vra.deployment/services/DeploymentsService";

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
        const deploymentId = System.getContext().getParameter("__metadata_deploymentId");
        if (!deploymentId) {
            throw Error("Missing deployment ID!");
        }
        logger.debug(`Deployment ID: ${deploymentId}`);

        const vraClientCreator = new VraClientCreator();

        const deploymentService = new DeploymentsService(vraClientCreator.createOperation());
        const deployment = deploymentService.getDeploymentByIdV3Using({
            "path_depId": deploymentId,
            "query_expand": ["resources"]
        });
        if (!deployment) {
            throw Error(`No deployment found with id '${deploymentId}'!`)
        }

        const volume = deployment.body.resources.filter(resource => resource.name === volumeName)[0];

        if (!volume) {
            throw Error(`Cannot create volume snapshot! Reason: No volume found with name '${volumeName}'.`)
        }
        
        logger.debug(`Matched volume: ${stringify(volume)}`);

        const volumeId = volume.id;

        const blockDevicesService = new BlockDevicesService(vraClientCreator.createOperation());
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
