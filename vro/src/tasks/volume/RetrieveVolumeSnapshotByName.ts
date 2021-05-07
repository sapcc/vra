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
import { stringify } from "../../utils";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class RetrieveVolumeSnapshotByName extends Task {
    private readonly logger: Logger;
    private readonly context: CreateVolumeFromSnapshotContext;
    private vCenterSoapService: VcenterSoapService;

    constructor(context: CreateVolumeFromSnapshotContext) {
        super(context);

        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.volume/RetrieveVolumeSnapshotByName");
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
    }

    execute() {
        const { diskId, datastore, snapshotName } = this.context;
        const snapshots = this.vCenterSoapService.retrieveVolumeSnapshots({ diskId, datastore });
        const snapshot = snapshots.filter(({ description }) => description === snapshotName)[0];

        if (!snapshot) {
            throw new Error(`Unable to retrieve snapshot with description '${snapshotName}'.`);
        }

        this.logger.info(`Found snapshot:\n${stringify(snapshot)}`);
        
        this.context.snapshotId = snapshot.id.id;
    }
}
