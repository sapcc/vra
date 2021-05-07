/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
import { BaseNicContext } from "./BaseNicContext";
import { NetworkDetail } from "./NetworkDetail";

export interface AttachNicToVmContext extends BaseNicContext {
    networkDetails: NetworkDetail[],
    timeoutInSeconds: number;
    sleepTimeInSeconds: number;
}
