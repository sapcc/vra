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
import { PATHS } from "../constants";
import { ConfigurationAccessor } from "../elements/accessors/ConfigurationAccessor";
import { Vcenter } from "../elements/configs/Vcenter.conf";
import { CreateVolumeFromSnapshotRequestContext } from "../types/volume/CreateVolumeFromSnapshotRequestContext";
import { validateResponse } from "../utils";

const Class = System.getModule("com.vmware.pscoe.library.class").Class();
const SoapClient = Class.load("com.vmware.pscoe.library.vc.soap.configuration", "SoapClient");
const Endpoint = Class.load("com.vmware.pscoe.library.vc.soap.configuration", "Endpoint");

const RestHostFactory = System.getModule("com.vmware.pscoe.library.rest").RestHostFactory();

const SOAP_REQUESTS = {
    CREATE_VOLUME_FROM_SNAPSHOT_SOAP_REQUEST:
        // eslint-disable-next-line max-len
        "<soapenv:Envelope xmlns:soapenc=\"http://schemas.xmlsoap.org/soap/encoding/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">\
        <soapenv:Body>\
            <CreateDiskFromSnapshot_Task xmlns=\"urn:vim25\">\
                <_this type=\"VcenterVStorageObjectManager\">VStorageObjectManager</_this>\
                <id>\
                    <id>{{diskId}}</id>\
                </id>\
                <datastore type=\"Datastore\">{{datastore}}</datastore>\
                <snapshotId>\
                    <id>{{snapshotId}}</id>\
                </snapshotId>\
                <name>{{newVolumeName}}</name>\
            </CreateDiskFromSnapshot_Task>\
        </soapenv:Body>\
    </soapenv:Envelope>\
"
};

export class VcenterSoapService {
    private readonly logger: Logger;
    private readonly soapClient: any;

    constructor() {
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.services/VcenterSoapService");

        const { name, url, authUserName, authPassword } = ConfigurationAccessor.loadConfig(PATHS.ENDPOINTS_VCENTER_CONFIG, {} as Vcenter);
        const restHost = RestHostFactory.newHostWithNoAuth(url, name);

        this.soapClient = new SoapClient(restHost, authUserName, authPassword);
    }

    public createVolumeFromSnapshot(requestContext: CreateVolumeFromSnapshotRequestContext) {
        const requestBody = System.getModule("com.vmware.pscoe.library.templates.engines")
            .mark(SOAP_REQUESTS.CREATE_VOLUME_FROM_SNAPSHOT_SOAP_REQUEST, requestContext);

        const response = this.soapClient.send(
            Endpoint.SDK,
            [],
            requestBody,
            Endpoint.URN.Vim25_70);

        validateResponse(response);

        this.logger.info(`Create volume from snapshot task:\n${response.contentAsString}`);
    }
}
