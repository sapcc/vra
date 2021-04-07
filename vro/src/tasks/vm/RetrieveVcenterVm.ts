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
import { BaseVmContext } from "../../types/vm/BaseVmContext";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class RetrieveVcenterVm extends Task {
    private readonly logger: Logger;
    private readonly context: BaseVmContext;
    private vCenterPluginService: VcenterPluginService;

    constructor(context: BaseVmContext) {
        super(context);
        
        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.tasks.vm/RetrieveVcenterVm");
    }

    prepare() {
        this.vCenterPluginService = new VcenterPluginService();
    }

    validate() {
        if (!this.context.machineId) {
            throw Error("'machineId' is not set!");
        }
    }

    execute() {
        const { machineId } = this.context;
        const vcVM = this.vCenterPluginService.getVmById(machineId);

        if (!vcVM) {
            throw Error(`Cannot get vCenter VM! Reason: No VM found with instanceUUID '${machineId}'.`);
        }

        this.logger.info(`Found VM from vCenter with name '${vcVM.name}'.`);
        
        this.context.vcVM = vcVM;
    }
}
