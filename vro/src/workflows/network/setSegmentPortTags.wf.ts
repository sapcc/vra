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
import { OPEN_STACK_SEGMENT_PORT_TAG, SEGMENT_PORT_TAG_VALUE as SEGMENT_PORT_TAG_SCOPE } from "../../constants";
import { PolicyTagService } from "com.vmware.pscoe.library.ts.nsxt.policy/services/PolicyTagService";
import { ListTaggedObjects0HttpResponse } from "com.vmware.pscoe.library.ts.nsxt.policy/models/ListTaggedObjects0HttpResponse";
import { PolicyResourceReference } from "com.vmware.pscoe.library.ts.nsxt.policy/models/PolicyResourceReference";

@Workflow({
    id: "7721de97-a5c2-4af1-ad86-f6626533d899",
    name: "Set Segment Port Tags",
    path: "SAP/One Strike/Segment Port"
})
export class SetSegmentPortTags {

    public execute(@In openStackSegmentPortId: string, @In openStackSecurityGroupId: string): void {
        const SingletonContextFactory = System.getModule("com.vmware.pscoe.library.context").SingletonContextFactory();
        const context: BaseContext = SingletonContextFactory.createLazy([
            "com.vmware.pscoe.library.context.workflow"
        ]);
        const logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.workflows.network/setSegmentPortTags");
        logger.info(`Context=${stringify(context)}`);

        if (!openStackSegmentPortId || !openStackSecurityGroupId) {
            throw new Error("Invalid input! 'segmentPortId', 'segmentId' and 'securityGroupId' are mandatory! ");
        }

        // get tag assosiated resources
        const tagsService = new PolicyTagService(NsxtClientCreator.build());
        const tagsResponse: ListTaggedObjects0HttpResponse = tagsService.listTaggedObjects0({
            "query_tag": openStackSegmentPortId,
            "query_scope": OPEN_STACK_SEGMENT_PORT_TAG
        });
        validateResponse(tagsResponse);

        // Get vRA Segment Port ID by initial tag (OpenStack UUID)
        const segPortInitialTag: PolicyResourceReference = tagsResponse.body.results[0];
        if (!segPortInitialTag) {
            throw new Error(`No tag found for mapping OpenStack UUID for segment port in vRA!`);
        }
        
        const pathArrPortsSplit = segPortInitialTag.path.split("/ports/");
        const segmentPortId: string = pathArrPortsSplit[pathArrPortsSplit.length-1];
        logger.debug(`Segment Port ID in vRA: ${segmentPortId}`);
        const pathArrSegmentsSplit = pathArrPortsSplit[0].split("/segments/");
        const segmentId: string = pathArrSegmentsSplit[pathArrSegmentsSplit.length-1];
        logger.debug(`Segment ID in vRA: ${segmentId}`);

        const patchInfraPayload = {
            "path_segment-id": segmentId,
            "path_port-id": segmentPortId,
            "body_SegmentPort": {
                tags: [
                    {
                        // Initial tag (mapping between OpenStack UUID and vRA ID)
                        tag: openStackSegmentPortId,
                        scope: OPEN_STACK_SEGMENT_PORT_TAG
                    },
                    {
                        // Tag for mapping to Security Group
                        tag: openStackSecurityGroupId, // OpenStack UUID for SG
                        scope: SEGMENT_PORT_TAG_SCOPE
                    }
                ]
            }
        };

        logger.debug(`Set Segment Port tags request payload: ${stringify(patchInfraPayload)}`);
        const policyConnectivityService = new PolicyConnectivityService(NsxtClientCreator.build());
        const response = policyConnectivityService.patchInfraSegmentPort(patchInfraPayload);
        logger.debug(`Set Segment Port tags to Segment port with ID '${openStackSegmentPortId}' response: ${stringify(response)}`);
        validateResponse(response);
        logger.info(`Tags set to Segment Port.`);
    }
    
}
