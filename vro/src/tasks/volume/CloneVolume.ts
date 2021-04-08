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
import { CloneVolumeContext } from "../../types/volume/CloneVolumeContext";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class CloneVolume extends Task {
    private readonly logger: Logger;
    private readonly context: CloneVolumeContext;
    private vCenterSoapService: VcenterSoapService;

    constructor(context: CloneVolumeContext) {
        super(context);

        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.volume/CloneVolume");
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

        if (!this.context.newVolumeName) {
            throw Error("'newVolumeName' is not set!");
        }
    }

    execute() {
        const { diskId, datastore, newVolumeName } = this.context;
        this.vCenterSoapService.cloneVolume({ diskId, datastore, newVolumeName});
    }
}
