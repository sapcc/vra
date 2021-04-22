/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
import { Logger } from "com.vmware.pscoe.library.ts.logging/Logger";
import { Future } from "com.vmware.pscoe.library.ts.util/Future";
import { GetBlockDevicesHttpResponse } from "com.vmware.pscoe.ts.vra.iaas/models/GetBlockDevicesHttpResponse";
import { GetFabricNetworksHttpResponse } from "com.vmware.pscoe.ts.vra.iaas/models/GetFabricNetworksHttpResponse";
import { BlockDevicesService } from "com.vmware.pscoe.ts.vra.iaas/services/BlockDevicesService";
import { validateResponse } from "../../utils";

export class WaitForVolumeHelper extends Future<GetFabricNetworksHttpResponse> {
    private readonly logger: Logger;

    constructor(private readonly context: BlockDevicesService, private readonly name: string) {
        super();
        
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.volume/WaitForVolumeHelper");
    }

    protected checkCompleted(): boolean {
        const params: any = {
            query_$filter: `name eq '${this.name}'` 
        };
        const response: GetBlockDevicesHttpResponse = this.context.getBlockDevices(params);

        validateResponse(response);
        
        this.value = response;

        return response.body.content.length === 1;
    }
}
