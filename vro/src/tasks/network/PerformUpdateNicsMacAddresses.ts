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

export class PerformUpdateNicsMacAddresses extends Task {
    private vCenterService: VcenterService;

    constructor(context: BaseNetworkContext) {
        super(context);
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.tasks.network/PerformUpdateNicsMacAddresses");
    }

    prepare() {
        this.vCenterService = new VcenterService();
    }

    validate() {
        if (!this.context.vcVM) {
            throw Error("vCenter VM is not set!");
        }

        if (!this.context.nicsMacAddresses) {
            throw Error("NICs MAC addresses are not set!");
        }
    }

    execute() {
        this.logger.info("About to change the MAC address of the existing VM (no duplicates allowed).");
        
        const { vcVM, nicsMacAddresses } = this.context;
        
        this.context.networks = this.vCenterService.updateVmNicsMac(vcVM, nicsMacAddresses);
    }
}
