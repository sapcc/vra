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
import { SegmentPort } from "com.vmware.pscoe.library.ts.nsxt.policy/models/SegmentPort";
import { Tag } from "com.vmware.pscoe.library.ts.nsxt.policy/models/Tag";
import { CANNOT_SET_INITIAL_TAG_SEG_PORT, OPEN_STACK_SEGMENT_PORT_TAG, PATHS } from "../../constants";
import { ConfigurationAccessor } from "../../elements/accessors/ConfigurationAccessor";
import { Config } from "../../elements/configs/Config.conf";
import { NsxtClientCreator } from "../../factories/creators/NsxtClientCreator";
import { NsxService } from "../../services/NsxService";
import { VcenterPluginService } from "../../services/VcenterPluginService";
import { AttachNicToVmContext } from "../../types/nic/AttachNicToVmContext";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class ReconfigureNetworksPorts extends Task {
    private readonly logger: Logger;
    private readonly context: AttachNicToVmContext;
    private nsxtService: NsxService;
    private vCenterPluginService: VcenterPluginService;

    constructor(context: AttachNicToVmContext) {
        super(context);

        this.context = context;
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.nic/ReconfigureVmNics");
    }

    prepare() {
        this.nsxtService = new NsxService(NsxtClientCreator.build());
        this.vCenterPluginService = new VcenterPluginService();
    }

    validate() {
        if (!this.context.vcVM) {
            throw Error("'vcVM' is not set!");
        }

        if (!this.context.nics) {
            throw Error("'nics' is not set!");
        }
    }

    execute() {
        const { vcVM, nics: contextNics, networkName, openStackSegmentPortIds } = this.context;

        const vcNics = this.vCenterPluginService.getNics(vcVM);

        if (!vcNics || vcNics.length === 0) {
            throw new Error(`${CANNOT_SET_INITIAL_TAG_SEG_PORT} no NICs found for VM in VC.`);
        }

        this.logger.debug(`NICs from VC: ${vcNics}`);

        for (let i = 0; i < contextNics.length; i++) {
            const macAddress = contextNics[i].device.macAddress;
            const newlyCreatedNic = vcNics.filter(vcNic => vcNic.macAddress === macAddress)[0];

            if (!newlyCreatedNic) {
                this.logger.error(`${CANNOT_SET_INITIAL_TAG_SEG_PORT} no NICs found with MAC address '${macAddress}' for VM.`);
                return;
            }

            const segmentPortAttachmentId = newlyCreatedNic.externalId;
            const segmentId = networkName;
            const tags: Tag[] = [{
                scope: OPEN_STACK_SEGMENT_PORT_TAG,
                tag: openStackSegmentPortIds[i] // OpenStack UUID for Segment Port
            }];

            const { timeoutInSeconds, sleepTimeInSeconds } =
                ConfigurationAccessor.loadConfig(PATHS.CONFIG, {} as Config);

            const segmentPort: SegmentPort = this.nsxtService.getSegmentPortByAttachment(
                segmentId, segmentPortAttachmentId, timeoutInSeconds, sleepTimeInSeconds
            );
            
            this.nsxtService.applyTagsToSegmentPort(segmentPort, tags);
        }
    }
}
