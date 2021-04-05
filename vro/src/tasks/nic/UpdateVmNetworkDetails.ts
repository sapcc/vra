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
import { UpdateVmNetworkDetailsContext } from "../../types/nic/UpdateVmNetworkDetailsContext";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class UpdateVmNetworkDetails extends Task {
    private readonly logger: Logger;
    private readonly context: UpdateVmNetworkDetailsContext
    private vCenterPluginService: VcenterPluginService;

    constructor(context: UpdateVmNetworkDetailsContext) {
        super(context);

        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.tasks.nic/UpdateVmNetworkDetails");
    }

    prepare() {
        this.vCenterPluginService = new VcenterPluginService();
    }

    validate() {
        if (!this.context.vcVM) {
            throw Error("'vcVM' is not set!");
        }

        if (!this.context.networkDetails) {
            throw Error("'networkDetails' are not set!");
        }
    }

    execute() {
        this.logger.info("About to change the MAC address of the existing VM (no duplicates allowed).");
        
        const { vcVM, networkDetails } = this.context;
        
        this.context.nics = this.vCenterPluginService.updateVmNicsMacAddress(vcVM, networkDetails);
    }
}
