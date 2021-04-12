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
import { CreateAndMaintainVlanSegmentsContext } from "../../types/network/CreateAndMaintainVlanSegmentsContext";
import { stringify, validateResponse } from "../../utils";
import { WaitForFabricNetworkHelper } from "./WaitForFabricNetworkHelper";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class WaitForFabricNetwork extends Task {
    private readonly logger: Logger;
    private readonly context: CreateAndMaintainVlanSegmentsContext;
    private fabricNetworkService: FabricNetworksService;

    constructor(context: CreateAndMaintainVlanSegmentsContext) {
        super(context);

        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.network/WaitForFabricNetwork");
    }

    prepare() {
        this.fabricNetworkService = new FabricNetworksService(VraClientCreator.build());
    }

    validate() {
        if (!this.context.segmentName) {
            throw Error("'segmentName' is not set!");
        }

        if (!this.context.timeoutInSeconds) {
            throw Error("'timeoutInSeconds' is not set!");
        }

        if (!this.context.sleepTimeInSeconds) {
            throw Error("'sleepTimeInSeconds' is not set!");
        }
    }

    execute() {
        this.logger.info("Waiting for Vlan segment to be collected in vRA ...");

        const { segmentName, timeoutInSeconds, sleepTimeInSeconds } = this.context;
        const execution = new WaitForFabricNetworkHelper(this.fabricNetworkService, segmentName);
        const response = execution.get(timeoutInSeconds, sleepTimeInSeconds);

        validateResponse(response);

        this.context.newFabricNetworkId = response.body.content[0].id;

        this.logger.info(`Found Fabric Network:\n${stringify(response)}`);
    }
}
