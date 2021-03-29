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
import { FabricNetworksService } from "com.vmware.pscoe.ts.vra.iaas/services/FabricNetworksService";
import { VraClientCreator } from "../../factories/creators/VraClientCreator";
import { CreateVlanSegmentContext } from "../../types/network/CreateVlanSegmentContext";
import { stringify, validateResponse } from "../../utils";
import { WaitForFabricNetworkHelper } from "./WaitForFabricNetworkHelper";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

const TIMEOUT_IN_SECONDS = 10 * 60;
const SLEEP_TIME_IN_SECONDS = 15;

export class WaitForFabricNetwork extends Task {
    private readonly logger: Logger;
    private fabricNetworkService: FabricNetworksService;

    constructor(context: CreateVlanSegmentContext) {
        super(context);
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.network/WaitForFabricNetwork");
    }

    prepare() {
        const vraClientCreator = new VraClientCreator();

        this.fabricNetworkService = new FabricNetworksService(vraClientCreator.createOperation());
    }

    validate() {
        if (!this.context.segmentName) {
            throw Error("'segmentName' is not set!");
        }
    }

    execute() {
        this.logger.info("Waiting for Vlan segment to be collected in vRA ...");

        const { segmentName } = this.context;
        const execution = new WaitForFabricNetworkHelper(this.fabricNetworkService, segmentName);
        const response = execution.get(TIMEOUT_IN_SECONDS, SLEEP_TIME_IN_SECONDS);

        validateResponse(response);

        this.context.newFabricNetworkId = response.body.content[0].id;

        this.logger.info(`Found Fabric Network:\n${stringify(response)}`);
    }
}
