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
import { MachinesService } from "com.vmware.pscoe.ts.vra.iaas/services/MachinesService";
import { VraClientCreator } from "../../factories/creators/VraClientCreator";
import { BaseVmContext } from "../../types/vm/BaseVmContext";
import { validateResponse } from "../../utils";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class PowerOffVm extends Task {
    private readonly logger: Logger;
    private readonly context: BaseVmContext;
    private machinesService: MachinesService;

    constructor(context: BaseVmContext) {
        super(context);

        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.vm/PowerOffVm");
    }

    prepare() {
        const vraClientCreator = new VraClientCreator();

        this.machinesService = new MachinesService(vraClientCreator.createOperation());
    }

    validate() {
        if (!this.context.resourceId) {
            throw Error("'resourceId' is not set!");
        }
    }

    execute() {
        const { resourceId } = this.context;

        const response = this.machinesService.powerOffMachine({
            path_id: resourceId
        });

        validateResponse(response);
    }
}
