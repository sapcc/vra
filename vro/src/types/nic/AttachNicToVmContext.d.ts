import { BaseNicContext } from "./BaseNicContext";
import { NetworkDetail } from "./NetworkDetail";

export interface AttachNicToVmContext extends BaseNicContext {
    networkDetails: NetworkDetail[],
    timeoutInSeconds: number;
    sleepTimeInSeconds: number;
}
