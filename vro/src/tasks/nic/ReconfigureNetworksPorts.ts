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
import { OPEN_STACK_SEGMENT_PORT_TAG, PATHS } from "../../constants";
import { CANNOT_SET_INITIAL_TAG_SEG_PORT } from "../../constants";
import { ConfigurationAccessor } from "../../elements/accessors/ConfigurationAccessor";
import { VroConfig } from "../../elements/configs/VroConfig.conf";
import { NsxtClientCreator } from "../../factories/creators/NsxtClientCreator";
import { NsxService } from "../../services/NsxService";
import { BaseNicContext } from "../../types/nic/BaseNicContext";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class ReconfigureNetworksPorts extends Task {
    private readonly logger: Logger;
    private nsxtService: NsxService;

    constructor(context: BaseNicContext) {
        super(context);
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.tasks.nic/ReconfigureVmNics");
    }

    prepare() {
        this.nsxtService = new NsxService(NsxtClientCreator.build());
    }

    validate() {
        if (!this.context.nics) {
            throw Error("'nics' is not set!");
        }
    }

    execute() {
        const { vcVM: contextVcVM, nics: contextNics, networkName, openStackSegmentPortIds } = this.context;

        let Class = System.getModule("com.vmware.pscoe.library.class").Class();
        let Networking = Class.load("com.vmware.pscoe.library.vc", "Networking");
        let vmNetworking = new Networking(contextVcVM);
        const vcNics: any[] = vmNetworking.getNics();
        if (!vcNics || vcNics.length == 0) {
            throw new Error(`${CANNOT_SET_INITIAL_TAG_SEG_PORT} no NICs found for VM in VC.`);
        }
        this.logger.debug(`NICs from VC: ${vcNics}`);

        for (let i = 0; i < contextNics.length; i++) {
            const macAddress = contextNics[i].device.macAddress;
            const newlyCreatedNic = vcNics.filter(vcNic => vcNic.macAddress == macAddress)[0];
            if (!newlyCreatedNic) {
                this.logger.error(`${CANNOT_SET_INITIAL_TAG_SEG_PORT} no NICs found with MAC address '${macAddress}' for VM.`);
                return;
            }

            const segmentPortAttachmentId = newlyCreatedNic.externalId;
            const segmentId = networkName;
            const tags: Tag[] = [
                {
                    tag: openStackSegmentPortIds[i], // OpenStack UUID for Segment Port
                    scope: OPEN_STACK_SEGMENT_PORT_TAG
                }
            ];

            const { getPortTimeoutInSeconds, getPortSleepTimeInSeconds } =
                ConfigurationAccessor.loadConfig(PATHS.VRO_CONFIG, {} as VroConfig);

            const segmentPort: SegmentPort = this.nsxtService.getSegmentPortByAttachment(
                segmentId, segmentPortAttachmentId, getPortTimeoutInSeconds, getPortSleepTimeInSeconds
            );
            this.nsxtService.applyTagsToSegmentPort(segmentPort, tags);
        }
    }
}
