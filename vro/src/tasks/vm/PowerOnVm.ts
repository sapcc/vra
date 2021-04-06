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
import { BaseVmContext } from "../../types/vm/BaseVmContext";
import { stringify, waitTask } from "../../utils";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class PowerOnVm extends Task {
    private readonly logger: Logger;
    private readonly context: BaseVmContext;
    
    constructor(context: BaseVmContext) {
        super(context);
        
        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.vm/PowerOnVm");
    }

    validate() {
        if (!this.context.vcVM) {
            throw Error("'vcVM' is not set!");
        }
    }

    prepare() {
        // no-op
    }

    execute() {
        const { vcVM } = this.context;

        try {
            this.logger.info("Start power on the VM.");

            const taskPowerOn = (vcVM as any).powerOnVM_Task();
            waitTask(taskPowerOn);
        } catch (error) {
            this.logger.error(`Error when try to power on the VM:\n${stringify(error)}`);
        } finally {
            this.logger.info("Power on completed.");
        }
    }
}
