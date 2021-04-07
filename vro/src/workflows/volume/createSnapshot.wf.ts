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
import { DeploymentsService } from "com.vmware.pscoe.ts.vra.deployment/services/DeploymentsService";
import { BlockDevicesService } from "com.vmware.pscoe.ts.vra.iaas/services/BlockDevicesService";
import { In, Workflow } from "vrotsc-annotations";
import { VraClientCreator } from "../../factories/creators/VraClientCreator";
import { BaseContext } from "../../types/BaseContext";
import { stringify, validateResponse } from "../../utils";

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
        const deploymentId = context.system.__metadata_deploymentId;
        if (!deploymentId) {
            throw Error("Missing deployment ID!");
        }
        logger.debug(`Deployment ID: ${deploymentId}`);

        const deploymentService = new DeploymentsService(VraClientCreator.build());
        const deployment = deploymentService.getDeploymentByIdV3Using({
            "path_depId": deploymentId,
            "query_expand": ["resources"]
        });
        if (!deployment) {
            throw Error(`No deployment found with id '${deploymentId}'!`);
        }

        const volume = deployment.body.resources.filter(resource => resource.name === volumeName)[0];

        if (!volume) {
            throw Error(`Cannot create volume snapshot! Reason: No volume found with name '${volumeName}'.`);
        }
        
        logger.debug(`Matched volume: ${stringify(volume)}`);

        const volumeId = volume.id;

        const blockDevicesService = new BlockDevicesService(VraClientCreator.build());
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
