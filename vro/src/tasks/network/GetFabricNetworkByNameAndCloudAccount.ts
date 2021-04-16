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
import { GetFabricNetworksHttpResponse } from "com.vmware.pscoe.ts.vra.iaas/models/GetFabricNetworksHttpResponse";
import { GetFabricNetworksParameters } from "com.vmware.pscoe.ts.vra.iaas/models/GetFabricNetworksParameters";
import { FabricNetworksService } from "com.vmware.pscoe.ts.vra.iaas/services/FabricNetworksService";
import { VraClientCreator } from "../../factories/creators/VraClientCreator";
import { GetSegmentFromPoolContext } from "../../types/network/GetSegmentFromPoolContext";
import { stringify, validateResponse } from "../../utils";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class GetFabricNetworkByNameAndCloudAccount extends Task {
    private readonly logger: Logger;
    private readonly context: GetSegmentFromPoolContext;
    private fabricNetworkService: FabricNetworksService;

    constructor(context: GetSegmentFromPoolContext) {
        super(context);

        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.network/GetFabricNetworkByNameAndCloudAccount");
    }

    prepare() {
        this.fabricNetworkService = new FabricNetworksService(VraClientCreator.build());
    }

    validate() {
        if (!this.context.segmentName) {
            throw Error("'segmentName' is not set!");
        }

        if (!this.context.segment) {
            throw Error("'segment' is not set!");
        }

        if (!this.context.cloudAccountId) {
            throw Error("'cloudAccountId' is not set!");
        }
    }

    execute() {
        const { segmentName, segment, cloudAccountId } = this.context;

        const params: GetFabricNetworksParameters = {
            query_$filter:
                `(name eq '${segmentName}' or name eq '${segment.display_name}') and cloudAccountIds.item eq '${cloudAccountId}'`
        };
        const response: GetFabricNetworksHttpResponse = this.fabricNetworkService.getFabricNetworks(params);

        validateResponse(response);

        if (response.body.content.length !== 1) {
            throw new Error(`Unable to filter fabric network with name '${segmentName}' / '${segment.display_name}' 
            and cloud account with id ${cloudAccountId}.`);
        }

        this.context.newFabricNetworkId = response.body.content[0].id;

        this.logger.info(`Found Fabric Network:\n${stringify(response)}`);
    }
}
