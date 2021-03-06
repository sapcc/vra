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
import { NetworkProfileSpecification } from "com.vmware.pscoe.ts.vra.iaas/models/NetworkProfileSpecification";
import { UpdateNetworkProfileParameters } from "com.vmware.pscoe.ts.vra.iaas/models/UpdateNetworkProfileParameters";
import { NetworkProfilesService } from "com.vmware.pscoe.ts.vra.iaas/services/NetworkProfilesService";
import { VraClientCreator } from "../../factories/creators/VraClientCreator";
import { GetSegmentFromPoolContext } from "../../types/network/GetSegmentFromPoolContext";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class UpdateFabricNetworksInNetworkProfile extends Task {
    private readonly logger: Logger;
    private readonly context: GetSegmentFromPoolContext;
    private networkProfilesService: NetworkProfilesService;

    constructor(context: GetSegmentFromPoolContext) {
        super(context);

        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.network/UpdateFabricNetworksInNetworkProfile");
    }

    prepare() {
        this.networkProfilesService = new NetworkProfilesService(VraClientCreator.build());
    }

    validate() {
        if (!this.context.networkProfileId) {
            throw Error("'networkProfileId' is not set!");
        }

        if (!this.context.newFabricNetworkId) {
            throw Error("'newFabricNetworkId' is not set!");
        }

        if (!this.context.currentFabricNetworkIds) {
            throw Error("'currentFabricNetworkIds' is not set!");
        }
    }

    execute() {
        const { networkProfileId, newFabricNetworkId, currentFabricNetworkIds } = this.context;

        this.networkProfilesService.updateNetworkProfile({
            path_id: networkProfileId,
            body_body: {
                fabricNetworkIds: [...currentFabricNetworkIds, newFabricNetworkId]
            } as NetworkProfileSpecification
        } as UpdateNetworkProfileParameters);

        this.logger.info("Added Fabric Network to Network Profile.");
    }
}
