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
import { UpdateVmContext } from "../../types/vm/UpdateVmContext";
import { stringify, validateResponse } from "../../utils";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class RetrieveVmNetworkDetailsFromResource extends Task {
    private readonly logger: Logger;
    private readonly context: UpdateVmContext;
    private vraClientCreator: VraClientCreator;
    private machinesService: MachinesService;

    constructor(context: UpdateVmContext) {
        super(context);

        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.vm/RetrieveNetworkDetailsFromResource");
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
            const networkDetails = JSON.parse(vm.customProperties?.networkDetails);

            this.logger.debug(`Found following network details to update:\n${stringify(networkDetails)}`);

            networkDetails.forEach(({ networkName, macAddress }) => {
                this.context.networkDetails.push({
                    networkName,
                    macAddress
                });
            });
        } else {
            this.logger.warn("Not found network details to update.");
        }
    }
}
