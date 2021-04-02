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
import { SOAP_ACTION, SOAP_REQUESTS } from "../../constants";
import { VraClientCreator } from "../../factories/creators/VraClientCreator";
import { CreateVolumeFromSnapshotContext } from "../../types/volume/CreateVolumeFromSnapshotContext";
import { validateResponse } from "../../utils";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class CreateVolumeFromSnapshot extends Task {
    private readonly logger: Logger;

    constructor(context: CreateVolumeFromSnapshotContext) {
        super(context);
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.volume/CreateVolumeFromSnapshot");
    }

    prepare() {
        const vraClientCreator = new VraClientCreator();

        this.blockDevicesService = new BlockDevicesService(vraClientCreator.createOperation());
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

        const Class = System.getModule("com.vmware.pscoe.library.class").Class();
        const SoapClient = Class.load("com.vmware.pscoe.library.vc.soap.configuration", "SoapClient");
        const Endpoint = Class.load("com.vmware.pscoe.library.vc.soap.configuration", "Endpoint");

        const RestHostFactory = System.getModule("com.vmware.pscoe.library.rest").RestHostFactory();

        // TODO: promote this as config element 
        const restHost = RestHostFactory.newHostWithNoAuth("https://vc-l-01a.corp.local", "https://vc-l-01a.corp.local");
        const client = new SoapClient(restHost, "administrator@vsphere.local", "VMware1!");

        const requestBody = System.getModule("com.vmware.pscoe.library.templates.engines")
            .mark(SOAP_REQUESTS.CREATE_VOLUME_FROM_SNAPSHOT_SOAP_REQUEST, {
                diskId,
                datastore,
                snapshotId,
                newVolumeName
            });

        const response = client.send(
            Endpoint.SDK,
            [],
            requestBody,
            SOAP_ACTION);

        validateResponse(response);

        this.logger.info(`Create volume from snapshot task:\n${response.contentAsString}`);
    }
}
