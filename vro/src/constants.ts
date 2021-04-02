/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
export const VRA_CONFIGURATION_PATH = "PS CoE/Library/vRA/VraConfiguration";

const PATH_ROOT = "SAP/One Strike";

export const PATHS = {
    VLAN_SEGMENT: `${PATH_ROOT}/VlanSegment`,
    ENDPOINTS_CONFIG: `${PATH_ROOT}/Endpoints`
};

export const CONNECT_INFO_DEFAULTS = {
    ALLOW_GUEST_CONTROL: false,
    CONNECTED: true,
    START_CONNECTED: true
};

export const NETWORK_DEFAULTS = {
    KEY: 0,
    UNIT_NUMBER: 0,
    ADDRESS_TYPE: "Manual"
};

export const DOMAIN_ID = "default";
export const SEGMENT_PORT_TAG_VALUE = "security_group";

export const SOAP_ACTION = "urn:vim25/7.0";

export const SOAP_REQUESTS = {
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
