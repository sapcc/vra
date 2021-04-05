/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
export type CreateVolumeFromSnapshotRequestContext = {
    diskId: string;
    datastore: string;
    snapshotId: string;
    newVolumeName: string;
}
