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
import { VraClientCreator } from "../../factories/creators/VraClientCreator";
import { BaseVolumeContext } from "../../types/volume/BaseVolumeContext";
import { stringify, validateResponse } from "../../utils";
import { WaitForVolumeHelper } from "./WaitForVolumeHelper";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class WaitForVolume extends Task {
    private readonly logger: Logger;
    private readonly context: BaseVolumeContext;
    private blockDevicesService: BlockDevicesService;

    constructor(context: BaseVolumeContext) {
        super(context);

        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.volume/WaitForVolume");
    }

    prepare() {
        this.blockDevicesService = new BlockDevicesService(VraClientCreator.build());
    }

    validate() {
        if (!this.context.newVolumeName) {
            throw Error("'newVolumeName' is not set!");
        }

        if (!this.context.timeoutInSeconds) {
            throw Error("'timeoutInSeconds' is not set!");
        }

        if (!this.context.sleepTimeInSeconds) {
            throw Error("'sleepTimeInSeconds' is not set!");
        }
    }

    execute() {
        this.logger.info("Waiting for Volume to be collected in vRA ...");

        const { newVolumeName, timeoutInSeconds, sleepTimeInSeconds } = this.context;
        const execution = new WaitForVolumeHelper(this.blockDevicesService, newVolumeName);
        const response = execution.get(timeoutInSeconds, sleepTimeInSeconds);

        validateResponse(response);

        this.context.newVolumeId = response.body.content[0].id;

        this.logger.info(`Found Volume:\n${stringify(response)}`);
    }
}
