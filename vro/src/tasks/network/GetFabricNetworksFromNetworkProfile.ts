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
import { GetNetworkProfileParameters } from "com.vmware.pscoe.ts.vra.iaas/models/GetNetworkProfileParameters";
import { NetworkProfilesService } from "com.vmware.pscoe.ts.vra.iaas/services/NetworkProfilesService";
import { VraClientCreator } from "../../factories/creators/VraClientCreator";
import { CreateVlanSegmentContext } from "../../types/network/CreateVlanSegmentContext";
import { stringify } from "../../utils";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

const FABRIC_NETWORK_ID_INDEX = 4;
const SEPARATOR = "/";

export class GetFabricNetworksFromNetworkProfile extends Task {
    private readonly logger: Logger;
    private readonly context: CreateVlanSegmentContext;
    private networkProfilesService: NetworkProfilesService;

    constructor(context: CreateVlanSegmentContext) {
        super(context);

        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.network/GetFabricNetworksFromNetworkProfile");
    }

    prepare() {
        const vraClientCreator = new VraClientCreator();

        this.networkProfilesService = new NetworkProfilesService(vraClientCreator.createOperation());
    }

    validate() {
        if (!this.context.networkProfileId) {
            throw Error("'networkProfileId' is not set!");
        }
    }

    execute() {
        const { networkProfileId } = this.context;

        const networkProfile = this.networkProfilesService.getNetworkProfile({
            path_id: networkProfileId
        } as GetNetworkProfileParameters).body;

        this.logger.info(`Network Profile:\n${stringify(networkProfile)}`);

        if (networkProfile._links["fabric-networks"]) {
            this.context.currentFabricNetworkIds = networkProfile._links["fabric-networks"]
                .hrefs
                // Example HREF to fabric network - "/iaas/api/fabric-networks/f199daf4-001e-40bd-935b-86560f729a61"
                .map(href => href.split(SEPARATOR)[FABRIC_NETWORK_ID_INDEX]);
        }
    }
}
