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
import { In, Workflow } from "vrotsc-annotations";
import { BaseContext } from "../../types/BaseContext";
import { stringify, validateResponse } from "../../utils";
import { NsxtClientCreator } from "../../factories/creators/NsxtClientCreator";
import { PolicyConnectivityService } from "com.vmware.pscoe.library.ts.nsxt.policy/services/PolicyConnectivityService";
import { SEGMENT_PORT_TAG_VALUE } from "../../constants";

@Workflow({
    id: "7721de97-a5c2-4af1-ad86-f6626533d899",
    name: "Set Segment Port Tags",
    path: "SAP/One Strike/Segment Port"
})
export class SetSegmentPortTags {

    public execute(@In segmentPortId: string, @In segmentId: string, @In securityGroupId: string): void {
        const SingletonContextFactory = System.getModule("com.vmware.pscoe.library.context").SingletonContextFactory();
        const context: BaseContext = SingletonContextFactory.createLazy([
            "com.vmware.pscoe.library.context.workflow"
        ]);
        const logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.workflows.network/setSegmentPortTags");
        logger.info(`Context=${stringify(context)}`);

        if (!segmentPortId || !segmentId || !securityGroupId) {
            throw new Error("Invalid input! 'segmentPortId', 'segmentId' and 'securityGroupId' are mandatory! ");
        }

        const patchInfraPayload = {
            "path_segment-id": segmentId,
            "path_port-id": segmentPortId,
            "body_SegmentPort": {
                tags: [
                    {
                        scope: SEGMENT_PORT_TAG_VALUE,
                        tag: securityGroupId // OpenStack UUID for SG
                    }
                ]
            }
        };

        logger.debug(`Set Segment Port tags request payload: ${stringify(patchInfraPayload)}`);
        const policyConnectivityService = new PolicyConnectivityService(NsxtClientCreator.build());
        const response = policyConnectivityService.patchInfraSegmentPort(patchInfraPayload);
        logger.debug(`Set Segment Port tags to Segment port with ID '${segmentPortId}' response: ${stringify(response)}`);
        validateResponse(response);
        logger.info(`Tags set to Segment Port.`);
    }
    
}
