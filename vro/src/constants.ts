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
    CONFIG: `${PATH_ROOT}/Config`,
    VLAN_SEGMENT_CONFIG: `${PATH_ROOT}/VlanSegment`,
    ENDPOINTS_CONFIG: `${PATH_ROOT}/Endpoints`,
    ENDPOINTS_VCENTER_CONFIG: `${PATH_ROOT}/Vcenter`,
    CREATE_AND_MAINTAIN_VLAN_SEGMENTS_WORKFLOW: `${PATH_ROOT}/Network/Create and Maintain Vlan Segments`
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
export const SEGMENT_PORT_TAG_SCOPE = "openstack_security_group_id";
export const OPEN_STACK_SEGMENT_PORT_TAG = "openstack_network_port_id";

export const SEGMENT_TAG = "openstack_network_id";
export const VOLUME_TAG = "openstack_volume_id";

// Error messages
export const CANNOT_SET_INITIAL_TAG_SEG_PORT = "Cannot add initial tag to Segment Port! Reason:";
export const CANNOT_GET_SEG_PORT_BY_ATTACHMENT = "Error occurred while retrieving Segment Port by attachment! NSX-T response:";

export const DEFAULT_SEGMENT_TAG = "pool";
export const DEFAULT_VLAN_ID = "0";
export const HTTP_CLIENT_RETRY_COUNT = 5;
