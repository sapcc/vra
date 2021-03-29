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
import { GetFabricNetworksHttpResponse } from "com.vmware.pscoe.ts.vra.iaas/models/GetFabricNetworksHttpResponse";
import { GetFabricNetworksParameters } from "com.vmware.pscoe.ts.vra.iaas/models/GetFabricNetworksParameters";
import { FabricNetworksService } from "com.vmware.pscoe.ts.vra.iaas/services/FabricNetworksService";
import { validateResponse } from "../../utils";

export class WaitForFabricNetworkHelper extends Future<GetFabricNetworksHttpResponse> {
    private readonly logger: Logger;

    constructor(private readonly context: FabricNetworksService, private readonly name: string) {
        super();
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.workflows.network/WaitForFabricNetwork");
    }

    protected checkCompleted(): boolean {
        const params: GetFabricNetworksParameters = {
            query_$filter: `name eq '${this.name}'` 
        };
        const response: GetFabricNetworksHttpResponse = this.context.getFabricNetworks(params);

        validateResponse(response);
        this.value = response;

        return response.body.content.length === 1;
    }
}
