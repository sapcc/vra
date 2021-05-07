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
import { VcenterPluginService } from "../../services/VcenterPluginService";
import { DetachNicFromVmContext } from "../../types/nic/DetachNicFromVmContext";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class DestroyNics extends Task {
    private readonly logger: Logger;
    private readonly context: DetachNicFromVmContext;
    private vCenterPluginService: VcenterPluginService;

    constructor(context: DetachNicFromVmContext) {
        super(context);

        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.tasks.nic/DestroyNic");
    }

    prepare() {
        this.vCenterPluginService = new VcenterPluginService();
    }

    validate() {
        if (!this.context.vcVM) {
            throw Error("vCenter VM is not set!");
        }

        if (!this.context.macAddresses) {
            throw Error("'macAddresses' are not set!");
        }
    }

    execute() {
        const { vcVM, macAddresses } = this.context;

        macAddresses.forEach((macAddress: string) =>
            this.vCenterPluginService.destroyNic(vcVM, macAddress));
    }
}
