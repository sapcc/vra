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

export class ReconfigureVmNics extends Task {
    private readonly logger: Logger;
    private vCenterService: VcenterService;

    constructor(context: BaseNicContext) {
        super(context);
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.nic/ReconfigureVmNics");
    }

    prepare() {
        this.vCenterService = new VcenterService();
    }

    validate() {
        if (!this.context.nics) {
            throw Error("'nics' is not set!");
        }

        if (!this.context.vcVM) {
            throw Error("'vcVM' is not set!");
        }
    }

    execute() {
        const { vcVM, nics } = this.context;

        nics.forEach((nic: VcVirtualDeviceConfigSpec) => this.vCenterService.reconfigureVM(vcVM, nic));
    }
}
