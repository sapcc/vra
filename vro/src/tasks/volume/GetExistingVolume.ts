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
import { GetBlockDevicesHttpResponse } from "com.vmware.pscoe.ts.vra.iaas/models/GetBlockDevicesHttpResponse";
import { BlockDevicesService } from "com.vmware.pscoe.ts.vra.iaas/services/BlockDevicesService";
import { VOLUME_TAG } from "../../constants";
import { VraClientCreator } from "../../factories/creators/VraClientCreator";
import { CreateVolumeFromSnapshotContext } from "../../types/volume/CreateVolumeFromSnapshotContext";
import { stringify, validateResponse } from "../../utils";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

const DATASTORE_INDEX = 1;
const DATASTORE_SEPARATOR = ":";

const VOLUME_INDEX = 0;
const VOLUME_COUNT = 1;

export class GetExistingVolume extends Task {
    private readonly logger: Logger;
    private blockDevicesService: BlockDevicesService;

    constructor(context: CreateVolumeFromSnapshotContext) {
        super(context);
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.volume/GetVolume");
    }

    prepare() {
        const vraClientCreator = new VraClientCreator();

        this.blockDevicesService = new BlockDevicesService(vraClientCreator.createOperation());
    }

    validate() {
        if (!this.context.existingVolumeName) {
            throw Error("'existingVolumeName' is not set!");
        }
    }

    execute() {
        const { existingVolumeName } = this.context;
        
        const params: any = {
            query_$filter: `tags.item.key eq '${VOLUME_TAG}' and tags.item.value eq '${existingVolumeName}'`
        };

        const response: GetBlockDevicesHttpResponse = this.blockDevicesService.getBlockDevices(params);

        validateResponse(response);

        if (response.body && response.body.content.length === VOLUME_COUNT) {
            this.logger.info(`Found existing volume:\n${stringify(response)}`);
            const volume = response.body?.content[VOLUME_INDEX];

            this.context.diskId = volume.customProperties?.vDiskId;
            this.context.datastore = volume.customProperties?.diskPlacementRef.split(DATASTORE_SEPARATOR)[DATASTORE_INDEX];
        } else {
            throw new Error(`Cannot find existing volume with tag '${VOLUME_TAG}' and '${existingVolumeName}'.`);
        }
    }
}
