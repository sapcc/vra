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
import { OnboardVmContext } from "../../types/vm/OnboardVmContext";
import { stringify, validateResponse } from "../../utils";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class UpdateVmTags extends Task {
    private readonly logger: Logger;
    private readonly context: OnboardVmContext;
    private machinesService: MachinesService;

    constructor(context: OnboardVmContext) {
        super(context);

        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.tasks.vm/UpdateVmTags");
    }

    prepare() {
        this.machinesService = new MachinesService(VraClientCreator.build());
    }

    validate() {
        if (!this.context.machineId) {
            throw Error("'machineId' is not set!");
        }

        if (!this.context.currentMachineTags) {
            throw Error("'currentMachineTags' is not set!");
        }

        if (!this.context.newMachineTags) {
            throw Error("'newMachineTags' is not set!");
        }
    }

    execute() {
        const { machineId, currentMachineTags, newMachineTags } = this.context;

        this.logger.info(`Current VM tags:\n${stringify(currentMachineTags)}`);

        const consolidatedMachineTags = [...currentMachineTags];
        newMachineTags.forEach(tag => {
            const [key, value] = tag.split(":");

            consolidatedMachineTags.push({
                key,
                value
            });
        });

        this.logger.info(`New VM tags:\n${stringify(consolidatedMachineTags)}`);

        const machineResponse = this.machinesService.updateMachine({
            path_id: machineId,
            body_body: {
                tags: consolidatedMachineTags
            }
        });

        validateResponse(machineResponse);
    }
}
