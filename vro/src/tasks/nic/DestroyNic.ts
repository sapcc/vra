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
import { BaseNicContext } from "../../types/nic/BaseNicContext";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class DestroyNic extends Task {
    private vCenterService: VcenterService;

    constructor(context: BaseNicContext) {
        super(context);
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.tasks.nic/DestroyNic");
    }

    prepare() {
        this.vCenterService = new VcenterService();
    }

    validate() {
        if (!this.context.vcVM) {
            throw Error("vCenter VM is not set!");
        }

        if (!this.context.macAddress) {
            throw Error("'macAddress' are not set!");
        }
    }

    execute() {
        const { vcVM, macAddress } = this.context;
        
        this.vCenterService.destroyNic(vcVM, macAddress);
    }
}
