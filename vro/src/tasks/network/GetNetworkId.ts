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
import { NetworksService } from "com.vmware.pscoe.ts.vra.iaas/services/NetworksService";
import { VraClientCreator } from "../../factories/creators/VraClientCreator";
import { GetSegmentFromPoolContext } from "../../types/network/GetSegmentFromPoolContext";
import { stringify, validateResponse } from "../../utils";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class GetNetworkId extends Task {
    private readonly logger: Logger;
    private readonly context: GetSegmentFromPoolContext;
    private networksService: NetworksService;

    constructor(context: GetSegmentFromPoolContext) {
        super(context);

        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.network/GetNetworkId");
    }

    prepare() {
        this.networksService = new NetworksService(VraClientCreator.build());
    }

    validate() {
        if (!this.context.segmentName) {
            throw Error("'segmentName' is not set!");
        }

        if (!this.context.segment) {
            throw Error("'segment' is not set!");
        }
    }

    execute() {
        const { segmentName, segment } = this.context;

        const response: GetFabricNetworksHttpResponse = this.networksService.getNetworks();

        validateResponse(response);

        const networks = response.body.content.filter(({ name }) => name === segmentName ||
            name === segment.display_name);

        if (networks.length !== 1) {
            throw new Error(`Unable to filter network with name '${segmentName}' / '${segment.display_name}'.`);
        }

        this.context.vRaNetworkId = networks[0].id;

        this.logger.info(`Found Network:\n${stringify(networks[0])}`);
    }
}
