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

export class ReconfigureVmNetworks extends Task {
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
        if (!this.context.networks) {
            throw Error("'networks' is not set!");
        }

        if (!this.context.vcVM) {
            throw Error("'vcVM' is not set!");
        }
    }

    execute() {
        const { vcVM, networks } = this.context;

        networks.forEach((network: VcVirtualDeviceConfigSpec) => this.vCenterService.reconfigureVM(vcVM, network));
    }
}
