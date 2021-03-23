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
import { In, Workflow } from "vrotsc-annotations";
import { VraClientCreator } from "../../factories/creators/VraClientCreator";

@Workflow({
    name: "Power Off VM",
    path: "SAP/One Strike/VM",
    input: {
        inputProperties: {
            type: "Properties"
        }
    }
})
export class PowerOffMachineWorkflow {
    public execute(@In inputProperties: Properties): void {
        const logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.workflows.dummy/powerOffMachine");
        const { resourceIds } = inputProperties;

        const vraClientCreator = new VraClientCreator();
        const machinesService = new MachinesService(vraClientCreator.createOperation());

        machinesService.powerOffMachine({ path_id: resourceIds });

        logger.debug(`VM with id '${resourceIds[0]}' has been powered off.`);
    }
}
