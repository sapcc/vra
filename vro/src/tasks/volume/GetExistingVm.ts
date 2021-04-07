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
import { AttachVolumeContext } from "../../types/volume/AttachVolumeContext";
import { stringify, validateResponse } from "../../utils";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class GetExistingVm extends Task {
    private readonly logger: Logger;
    private readonly context: AttachVolumeContext;
    private machinesService: MachinesService;

    constructor(context: AttachVolumeContext) {
        super(context);

        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.volume/GetExistingVm");
    }

    prepare() {
        this.machinesService = new MachinesService(VraClientCreator.build());
    }

    validate() {
        if (!this.context.storageDetails) {
            throw Error("'storageDetails' is not set!");
        }
    }

    execute() {
        const { storageDetails } = this.context;

        storageDetails.forEach(({ resourceName }, index) => {
            const response = this.machinesService.getMachines();

            validateResponse(response);

            const { body: { content } } = response;

            this.logger.debug(`Machines=${stringify(content)}`);

            const machine = content.filter(machine => machine.name === resourceName)[0];

            if (!machine) {
                throw new Error(`Unable to find machine with resourceName '${resourceName}'`);
            }

            this.logger.debug(`Machine=${stringify(machine)}`);

            this.context[index].vmId = machine.id;
        });
    }
}
