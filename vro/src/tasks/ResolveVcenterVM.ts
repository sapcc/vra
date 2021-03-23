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

export class ResolveVcenterVM extends Task {
    private readonly logger: Logger;

    constructor(context: UpdateNicsMacAddressesContext) {
        super(context);
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.tasks/ResolveVcenterVM");
    }

    prepare() {
        // no-op
    }
    
    validate() {
        if (!this.context.instanceUUID) {
            throw Error("Cannot get instanceUUID!");
        }
    }

    execute() {
        const vCenterService = new VcenterService();
        const vcVM = vCenterService.getVmById(this.context.instanceUUID);

        if (!vcVM) {
            throw Error(`Cannot get vCenter VM! Reason: No VM found with instanceUUID '${this.context.instanceUUID}'.`);
        }

        this.logger.info(`Found VM from vCenter with name '${vcVM.name}'.`);
        this.context.vcVM = vcVM;
    }
}
