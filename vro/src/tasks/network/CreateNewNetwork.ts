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
import { VcenterService } from "../../services/VcenterService";
import { BaseNetworkContext } from "../../types/network/BaseNetworkContext";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class CreateNewNetwork extends Task {
    private readonly logger: Logger;
    private vCenterService: VcenterService;

    constructor(context: BaseNetworkContext) {
        super(context);
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.network/CreateNewNetwork");
    }

    prepare() {
        this.vCenterService = new VcenterService();
    }

    validate() {
        if (!this.context.networkName) {
            throw Error("'networkName' is not set!");
        }

        if (!this.context.macAddress) {
            throw Error("'macAddress' is not set!");
        }
    }

    execute() {
        const { networkName, macAddress } = this.context;

        this.context.networks.push(this.vCenterService.createNewNetwork(networkName, macAddress));
    }
}
