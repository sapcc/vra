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
import { VcenterSoapService } from "../../services/VcenterSoapService";
import { CreateVolumeFromSnapshotContext } from "../../types/volume/CreateVolumeFromSnapshotContext";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class CreateVolumeFromSnapshot extends Task {
    private readonly logger: Logger;
    private vCenterSoapService: VcenterSoapService;

    constructor(context: CreateVolumeFromSnapshotContext) {
        super(context);
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.volume/CreateVolumeFromSnapshot");
    }

    prepare() {
        this.vCenterSoapService = new VcenterSoapService();
    }

    validate() {
        if (!this.context.diskId) {
            throw Error("'diskId' is not set!");
        }

        if (!this.context.datastore) {
            throw Error("'datastore' is not set!");
        }

        if (!this.context.snapshotId) {
            throw Error("'snapshotId' is not set!");
        }

        if (!this.context.newVolumeName) {
            throw Error("'newVolumeName' is not set!");
        }
    }

    execute() {
        const { diskId, datastore, snapshotId, newVolumeName } = this.context;
        this.vCenterSoapService.createVolumeFromSnapshot({ diskId, datastore, snapshotId, newVolumeName });
    }
}
