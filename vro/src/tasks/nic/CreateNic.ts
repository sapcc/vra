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
import { AttachNicToVmContext } from "../../types/nic/AttachNicToVmContext";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class CreateNic extends Task {
    private readonly logger: Logger;
    private readonly context: AttachNicToVmContext;
    private vCenterPluginService: VcenterPluginService;

    constructor(context: AttachNicToVmContext) {
        super(context);

        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.nic/createNic");
    }

    prepare() {
        this.vCenterPluginService = new VcenterPluginService();
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

        this.context.nics.push(this.vCenterPluginService.createNic(networkName, macAddress));
    }
}
