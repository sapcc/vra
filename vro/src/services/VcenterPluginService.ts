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
import { CONNECT_INFO_DEFAULTS, NETWORK_DEFAULTS } from "../constants";
import { NicsMacAddress } from "../types/nic/NicsMacAddress";

const Class = System.getModule("com.vmware.pscoe.library.class").Class();

const OPAQUE_NETWORK = "OpaqueNetwork";

export class VcenterPluginService {
    private readonly logger: Logger;

    constructor() {
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.services/VcenterPluginService");
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

    public updateVmNicsMac = (vcVM: VcVirtualMachine, macAddresses: NicsMacAddress[]): VcVirtualDeviceConfigSpec[] => {
        const Networking = Class.load("com.vmware.pscoe.library.vc", "Networking");
        const vmNetworking = new Networking(vcVM);

        return macAddresses.map(({ deviceIndex, macAddress }) => {
            const nic = this.getNicByNumber(vmNetworking, deviceIndex);

            this.logger.info(`Found NIC '${nic.toString()}'.`);
            this.logger.info(`Current MAC address: '${nic.macAddress}'.`);
            this.logger.info(`Target MAC address: '${macAddress}'.`);

            nic.macAddress = macAddress;

            this.logger.info("About to prepare VcVirtualDeviceConfigSpec ...");

            const deviceConfigSpec = new VcVirtualDeviceConfigSpec();

            deviceConfigSpec.device = nic;
            deviceConfigSpec.operation = VcVirtualDeviceConfigSpecOperation.edit;

            return deviceConfigSpec;
        });
    };

    public createNic = (name: string, macAddress: string): VcVirtualDeviceConfigSpec => {
        this.logger.info("Creating connectable info for network ...");
        const connectInfo = new VcVirtualDeviceConnectInfo();

        connectInfo.allowGuestControl = CONNECT_INFO_DEFAULTS.ALLOW_GUEST_CONTROL;
        connectInfo.connected = CONNECT_INFO_DEFAULTS.CONNECTED;
        connectInfo.startConnected = CONNECT_INFO_DEFAULTS.START_CONNECTED;

        this.logger.info("Creating Network BackingInfo ...");
        const networks = VcPlugin.getAllNetworks([], "");
        const targetNetwork = Array.from(networks).find(n => n.name === name);

        if (targetNetwork.type !== OPAQUE_NETWORK) {
            throw new Error(`Unsupported network type. Current type is '${targetNetwork.type}'. Support only ${OPAQUE_NETWORK} type.`);
        }

        const netBackingInfo = new VcVirtualEthernetCardOpaqueNetworkBackingInfo();

        netBackingInfo.opaqueNetworkId = (targetNetwork.summary as VcOpaqueNetworkSummary).opaqueNetworkId;
        netBackingInfo.opaqueNetworkType = (targetNetwork.summary as VcOpaqueNetworkSummary).opaqueNetworkType;

        this.logger.info("Creating Virtual Network ...");

        const vNetwork = new VcVirtualVmxnet3();

        vNetwork.backing = netBackingInfo;
        vNetwork.key = NETWORK_DEFAULTS.KEY;
        vNetwork.unitNumber = NETWORK_DEFAULTS.UNIT_NUMBER;
        vNetwork.addressType = NETWORK_DEFAULTS.ADDRESS_TYPE;
        vNetwork.macAddress = macAddress;
        vNetwork.connectable = connectInfo;

        this.logger.info("Creating Network ConfigSpec ...");
        const deviceConfigSpec = new VcVirtualDeviceConfigSpec();

        deviceConfigSpec.device = vNetwork;
        deviceConfigSpec.operation = VcVirtualDeviceConfigSpecOperation.add;

        return deviceConfigSpec;
    }

    public destroyNic(vcVM: VcVirtualMachine, macAddress: string): void {
        this.logger.info("About to destroy Nic ...");

        const Networking = Class.load("com.vmware.pscoe.library.vc", "Networking");
        const vmNetworking = new Networking(vcVM);

        const nic = vmNetworking.getNicByMac(macAddress);

        if (!nic) {
            throw new Error(`Cannot find Nic with MAC address '${macAddress}.`);
        }

        vmNetworking.destroyNic(nic);
        this.logger.info("Done.");
    }

    public reconfigureVM(vcVM: VcVirtualMachine, deviceConfigSpec: VcVirtualDeviceConfigSpec): void {
        const ReconfigurationTransaction =
            Class.load("com.vmware.pscoe.library.vc.config", "ReconfigurationTransaction");

        this.logger.info("About to create ReconfigurationTransaction ...");

        const transaction = new ReconfigurationTransaction(vcVM);
        transaction.add(deviceConfigSpec);

        this.logger.info("About to commit ReconfigurationTransaction ...");
        transaction.commit();

        this.logger.info("Done.");
    }
}
