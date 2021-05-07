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
import { AttachMachineDiskParameters } from "com.vmware.pscoe.ts.vra.iaas/models/AttachMachineDiskParameters";
import { DiskAttachmentSpecification } from "com.vmware.pscoe.ts.vra.iaas/models/DiskAttachmentSpecification";
import { MachinesService } from "com.vmware.pscoe.ts.vra.iaas/services/MachinesService";
import { VraClientCreator } from "../../factories/creators/VraClientCreator";
import { AttachVolumeToVmContext } from "../../types/volume/AttachVolumeToVmContext";
import { validateResponse } from "../../utils";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class AttachVolumeToVm extends Task {
    private readonly logger: Logger;
    private readonly context: AttachVolumeToVmContext;
    private machinesService: MachinesService;

    constructor(context: AttachVolumeToVmContext) {
        super(context);

        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.volume/AttachVolumeToVm");
    }

    prepare() {
        this.machinesService = new MachinesService(VraClientCreator.build());
    }

    validate() {
        if (!this.context.resourceId) {
            throw Error("'resourceId' is not set!");
        }
        
        if (!this.context.storageDetails) {
            throw Error("'storageDetails' is not set!");
        }
    }

    execute() {
        const { storageDetails, resourceId } = this.context;

        storageDetails.forEach(({ blockDeviceId }) => {
            this.logger.info(`Attaching volume with id '${blockDeviceId}' to vm with id '${resourceId}'.`);

            const params: AttachMachineDiskParameters = {
                path_id: resourceId,
                body_body: {
                    blockDeviceId
                } as DiskAttachmentSpecification
            };
            const response = this.machinesService.attachMachineDisk(params);

            validateResponse(response);

            this.logger.info(`Attached volume with id '${blockDeviceId}' to vm with id '${resourceId}'.`);
        });
    }
}
