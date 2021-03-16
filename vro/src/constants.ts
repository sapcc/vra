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

const PATH_ROOT = "Berkeley/vRA Extensibility";

export const PATHS = {
    CONFIG: `${PATH_ROOT}/Config`
};

export const BACKUP_TAGS_SEPARATOR = "-";
export const OS_SEPARATOR = " ";
export const FIRST_ELEMENT = 0;
export const INCREMENT_BACKUP_TAG = 1;
export const PADDING_MAX_LENGTH_BACKUP_TAG = 2;
export const PADDING_FILL_STRING_BACKUP_TAG = "0";
export const RESULT_SEPARATOR = "_";
export const THROW_IF_MISSING = true;
export const BACKUP_TAGS_KEY = "backupTagIndex";
export const TAGS_KEY = "tags";

const PATH_REA_ROOT = "vra-extensibility/elements/resource/";

export const BACKUP_TAGS_REA_PATH = `${PATH_REA_ROOT}backupTagsRegister.json`;
export const OS_TYPE_REA_PATH = `${PATH_REA_ROOT}osType.json`;
export const BERKELEY_CUSTOM_PROPERTIES_REA_PATH = `${PATH_REA_ROOT}berkeleyCustomProperties.json`;
