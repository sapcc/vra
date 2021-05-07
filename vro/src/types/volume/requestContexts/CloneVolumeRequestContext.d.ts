/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
export type CloneVolumeRequestContext = {
    diskId: string;
    datastore: string;
    newVolumeName: string;
}
