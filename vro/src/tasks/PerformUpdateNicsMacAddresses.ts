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
import { VcenterService } from "../services/VcenterService";
import { UpdateNicsMacAddressesContext } from "../types/UpdateNicsMacAddressesContext";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class PerformUpdateNicsMacAddresses extends Task {
    constructor(context: UpdateNicsMacAddressesContext) {
        super(context);
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.task/PerformUpdateNicsMacAddresses");
    }

    prepare() {
        // no-op
    }

    validate() {
        // no-op
    }
    
    execute() {
        this. logger.info("About to change the MAC address of the existing VM (no duplicates allowed).");
        const vCenterService = new VcenterService();
        vCenterService.updateVmNicsMac(this.context.vcVM, this.context.nicsMacAddresses);
    }
}
