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
    VLAN_SEGMENT: `${PATH_ROOT}/VlanSegment`,
    VOLUME: `${PATH_ROOT}/Volume`,
    ENDPOINTS_CONFIG: `${PATH_ROOT}/Endpoints`,
    ENDPOINTS_VCENTER_CONFIG: `${PATH_ROOT}/Vcenter`
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

