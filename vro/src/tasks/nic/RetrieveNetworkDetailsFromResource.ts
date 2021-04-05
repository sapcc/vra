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
import { UpdateVmNetworkDetailsContext } from "../../types/nic/UpdateVmNetworkDetailsContext";
import { stringify, validateResponse } from "../../utils";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class RetrieveNetworkDetailsFromResource extends Task {
    private readonly logger: Logger;
    private readonly context: UpdateVmNetworkDetailsContext;
    private vraClientCreator: VraClientCreator;
    private machinesService: MachinesService;

    constructor(context: UpdateVmNetworkDetailsContext) {
        super(context);

        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.nic/RetrieveNetworkDetailsFromResource");
    }

    prepare() {
        this.vraClientCreator = new VraClientCreator();
        this.machinesService = new MachinesService(this.vraClientCreator.createOperation());
    }

    validate() {
        if (!this.context.resourceId) {
            throw Error("'resourceId' is not set!");
        }
    }

    execute() {
        const { resourceId } = this.context;
        const response = this.machinesService.getMachine({ path_id: resourceId });

        validateResponse(response);

        const { body: vm } = response;

        if (!vm) {
            throw Error(`No VM found for resource id '${resourceId}'!`);
        }

        if (vm.customProperties.networkDetails) {
            this.context.networkDetails = JSON.parse(vm.customProperties?.networkDetails);
            this.logger.debug(`Found following network details to update:\n${stringify(this.context.networkDetails)}`);
        } else {
            this.logger.warn("Not found network details to update.");
        }
    }
}
