/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
import { StorageDetail } from "./StorageDetail";

export interface AttachVolumeToVmContext {
    resourceId: string;
    storageDetails: StorageDetail[];
}
