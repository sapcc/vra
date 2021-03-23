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
import { DeploymentsService } from "com.vmware.pscoe.ts.vra.deployment/services/DeploymentsService";
import { In, Workflow } from "vrotsc-annotations";
import { VraClientCreator } from "../../factories/creators/VraClientCreator";

@Workflow({
    name: "Change NIC MAC",
    path: "SAP/One Strike/Virtual Machine",
    input: {
        inputProperties: {
            type: "Properties"
        }
    }
})
export class ChangeNicMacWorkflow {
    public execute(@In inputProperties: Properties): void {
        const logger = 
            Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.workflows.dummy/ChangeNicMacWorkflow");

        const getRandomMacAddress = () => {
            return "XX:XX:XX:XX:XX:XX".replace(/X/g, function () {
                return "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16));
            });
        };

        const getVmById = (instanceId: string): VcVirtualMachine => {
            const vm = VcPlugin.getAllVirtualMachines(null, `xpath:matches(instanceId, '${instanceId}')`);

            if (!vm || !vm.length) {
                throw new Error(`Can't find VM with instanceId '${instanceId}'.`);
            }

            return vm[0];
        };

        const vm = getVmById("503b71b3-b398-a899-0d5c-576b7e62ff0c");

        logger.debug(`vCenter VM name '${vm.name}'.`);

        // const { resourceIds } = inputProperties;

        const vraClientCreator = new VraClientCreator();
        // const machinesService = new MachinesService(vraClientCreator.createOperation());
        const deploymentId = "a4930be9-8314-40e3-be63-58b5a6c00c3a";
        const deploymentService = new DeploymentsService(vraClientCreator.createOperation());
        const { body: { content: resources } } = deploymentService.getDeploymentResourcesUsingGET2({
            "path_depId": deploymentId
        });

        if (!resources.length) {
            throw Error(`No resources found for deployment id '${deploymentId}'!`);
        }

        const resource = resources.filter(resource => resource.id === "2b124d98-4e1f-4fe1-b13f-848cb0778ac1")[0];

        if (!resource) {
            throw Error(`Cannot get resource! Reason: No resource found with name '${"2b124d98-4e1f-4fe1-b13f-848cb0778ac1"}'.`);
        }

        const { properties: { primaryMAC } } = resource;
        logger.info(`Existing VM MAC address '${primaryMAC}'.`);

        logger.info("About to change the MAC address of the existing VM (no duplicates allowed).");

        const getNicByNumber = (vmNetworking, nicNumber) => {
            const networkAdapters = vmNetworking.getNics()
            .filter(nic => nic.deviceInfo.label === "Network adapter " + (nicNumber + 1));

            if (!networkAdapters || networkAdapters.length !== 1) {
                throw new Error(`Unable to find nic ${nicNumber + 1}.`);
            }

            return networkAdapters[0];
        };

        const updateVmNicsMac = (vcVM, macs: string[]) => {
            const Class = System.getModule("com.vmware.pscoe.library.class").Class();
            const Networking = Class.load("com.vmware.pscoe.library.vc", "Networking");
            const ReconfigurationTransaction = 
                Class.load("com.vmware.pscoe.library.vc.config", "ReconfigurationTransaction");
            const vmNetworking = new Networking(vcVM);

            vm.config.hardware.device.forEach(d => logger.debug(d.deviceInfo.label));

            macs.forEach((mac, i) => {
                const nic = getNicByNumber(vmNetworking, i);
                logger.info(`Found Nic '${nic.toString()}', current MAC address: '${nic.macAddress}', target MAC address '${mac}'.`);
                nic.macAddress = mac;

                logger.info("About to prepare VcVirtualDeviceConfigSpec ...");
                const deviceConfigSpec = new VcVirtualDeviceConfigSpec();
                deviceConfigSpec.device = nic;
                deviceConfigSpec.operation = VcVirtualDeviceConfigSpecOperation.edit;

                logger.info("About to create ReconfigurationTransaction ...");

                const transaction = new ReconfigurationTransaction(vcVM);

                transaction.add(deviceConfigSpec);

                logger.debug(deviceConfigSpec as unknown as string);
                logger.info("About to commit ReconfigurationTransaction ...");
                transaction.commit();

                logger.info(`updateVmNic${i} - VM NIC${i} Mac updated successfully. - '${mac}'.`);
            });
        };

        updateVmNicsMac(vm, [getRandomMacAddress()]);

        const deviceConfigSpec = new VcVirtualDeviceConfigSpec();
        deviceConfigSpec.operation = VcVirtualDeviceConfigSpecOperation.add;
        deviceConfigSpec.device = new VcVirtualDevice();
        // machinesService.powerOffMachine({ path_id: resourceIds });

        // logger.debug(`Machine '${resourceIds[0]}' has been powered off.`);
    }
}
