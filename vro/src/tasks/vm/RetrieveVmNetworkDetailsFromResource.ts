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
import { NetworksService } from "com.vmware.pscoe.ts.vra.iaas/services/NetworksService";
import { OPEN_STACK_SEGMENT_PORT_TAG, SEGMENT_TAG } from "../../constants";
import { VraClientCreator } from "../../factories/creators/VraClientCreator";
import { UpdateVmContext } from "../../types/vm/UpdateVmContext";
import { stringify, validateResponse } from "../../utils";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class RetrieveVmNetworkDetailsFromResource extends Task {
    private readonly logger: Logger;
    private readonly context: UpdateVmContext;
    private machinesService: MachinesService;
    private networksService: NetworksService;

    constructor(context: UpdateVmContext) {
        super(context);

        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.vm/RetrieveNetworkDetailsFromResource");
    }

    prepare() {
        this.machinesService = new MachinesService(VraClientCreator.build());
        this.networksService = new NetworksService(VraClientCreator.build());
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

            networkDetails.forEach(networkDetail => {
                // TODO: vRA id will be provided from openstack
                const networkId = networkDetail[SEGMENT_TAG];
                const networkPortId = networkDetail[OPEN_STACK_SEGMENT_PORT_TAG];
                
                const networkName = this.networksService.getNetwork({
                    path_id: networkId
                }).body.name;
                
                this.context.networkDetails.push({
                    networkName,
                    macAddress: networkDetail.macAddress,
                    networkPortId
                });
            });
        } else {
            this.logger.warn("Not found network details to update.");
        }
    }
}
