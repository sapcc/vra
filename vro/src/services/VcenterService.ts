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
import { NicsMacAddress } from "../types/NicsMacAddress";

export class VcenterService {
    private readonly logger: Logger;

    constructor() {
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.services/VcenterService");
    }

    public getVmById = (instanceId: string): VcVirtualMachine => {
        const vm = VcPlugin.getAllVirtualMachines(null, `xpath:matches(instanceId, '${instanceId}')`);

        if (!vm || !vm.length) {
            throw new Error(`Can't find VM with instanceId '${instanceId}'.`);
        }

        return vm[0];
    };

    private getNicByNumber = (vmNetworking: any, nicNumber: number) => {
        const networkAdapters = vmNetworking.getNics()
            .filter(nic => nic.deviceInfo.label === "Network adapter " + (nicNumber + 1));

        if (!networkAdapters || networkAdapters.length !== 1) {
            throw new Error(`Unable to find nic ${nicNumber + 1}.`);
        }

        return networkAdapters[0];
    };

    public updateVmNicsMac = (vcVM: VcVirtualMachine, macAddresses: NicsMacAddress[]) => {
        const Class = System.getModule("com.vmware.pscoe.library.class").Class();
        const Networking = Class.load("com.vmware.pscoe.library.vc", "Networking");
        const ReconfigurationTransaction =
            Class.load("com.vmware.pscoe.library.vc.config", "ReconfigurationTransaction");
        const vmNetworking = new Networking(vcVM);

        macAddresses.forEach(({ deviceIndex, macAddress }) => {
            const nic = this.getNicByNumber(vmNetworking, deviceIndex);

            this.logger.info(`Found NIC '${nic.toString()}'.`);
            this.logger.info(`Current MAC address: '${nic.macAddress}'.`);
            this.logger.info(`Target MAC address: '${macAddress}'.`);

            nic.macAddress = macAddress;

            this.logger.info("About to prepare VcVirtualDeviceConfigSpec ...");

            const deviceConfigSpec = new VcVirtualDeviceConfigSpec();
            deviceConfigSpec.device = nic;
            deviceConfigSpec.operation = VcVirtualDeviceConfigSpecOperation.edit;

            this.logger.info("About to create ReconfigurationTransaction ...");

            const transaction = new ReconfigurationTransaction(vcVM);
            transaction.add(deviceConfigSpec);

            this.logger.info("About to commit ReconfigurationTransaction ...");
            transaction.commit();

            this.logger.info(`updateVmNic${deviceIndex} - VM NIC${deviceIndex} Mac updated successfully. - '${macAddress}'.`);
        });
    };
}
