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
    ENDPOINTS_CONFIG: `${PATH_ROOT}/Endpoints`,
    VRO_CONFIG: `${PATH_ROOT}/vRO Config`
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

// Error messages
export const CANNOT_SET_INITIAL_TAG_SEG_PORT = "Cannot add initial tag to Segment Port! Reason:"
export const CANNOT_GET_SEG_PORT_BY_ATTACHMENT = "Error occurred while retrieving Segment Port by attachment! NSX-T response:"
