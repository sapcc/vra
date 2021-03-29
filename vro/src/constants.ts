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
    CONNECTED: false,
    START_CONNECTED: true
};

export const NETWORK_DEFAULTS = {
    KEY: 0,
    UNIT_NUMBER: 0,
    ADDRESS_TYPE: "Manual"
};

export const DOMAIN_ID = "default";
export const SEGMENT_PORT_TAG_VALUE = "security_group";
