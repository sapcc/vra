
/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
export interface BaseVolumeContext {
    existingVolumeName: string;
    diskId?: string;
    datastore?: string;
    newVolumeName: string;
    newVolumeId?: string;
    timeoutInSeconds: number;
    sleepTimeInSeconds: number;
}
