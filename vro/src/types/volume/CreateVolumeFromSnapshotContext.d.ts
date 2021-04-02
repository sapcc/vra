
/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
export interface CreateVolumeFromSnapshotContext {
    existingVolumeName: string
    diskId?: string
    datastore?: string
    snapshotId: string,
    newVolumeName: string,
    timeoutInSeconds: number;
    sleepTimeInSeconds: number;
    newVolumeId?: string
}
