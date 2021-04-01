/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
import { HttpClient } from "com.vmware.pscoe.library.ts.http/HttpClient";
import { Logger } from "com.vmware.pscoe.library.ts.logging/Logger";
import {
    PatchInfraSegmentWithForceTrueParameters
} from "com.vmware.pscoe.library.ts.nsxt.policy/models/PatchInfraSegmentWithForceTrueParameters";
import { Segment } from "com.vmware.pscoe.library.ts.nsxt.policy/models/Segment";
import { Tag } from "com.vmware.pscoe.library.ts.nsxt.policy/models/Tag";
import { PolicyConnectivityService } from "com.vmware.pscoe.library.ts.nsxt.policy/services/PolicyConnectivityService";
import { NsxtClientCreator } from "../factories/creators/NsxtClientCreator";
import { stringify, validateResponse } from "../utils";
import { SEGMENT_PORT_TAG_SCOPE } from "../constants";

export class NsxService {
    private readonly logger: Logger;
    private readonly httpClient: HttpClient;
    private readonly policyConnectivityService: PolicyConnectivityService;

    constructor(httpClient: HttpClient) {
        this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.services.NsxService");
        this.httpClient = httpClient;
        this.policyConnectivityService = new PolicyConnectivityService(httpClient);
    }

    public createVlanSegments(segmentName: string, transportZoneId: string, vlanId: string): Segment {
        const segment = {
            display_name: segmentName,
            vlan_ids: vlanId.replace(/[ ]/g, "").split(","),
            transport_zone_path: `/infra/sites/default/enforcement-points/default/transport-zones/${transportZoneId}`
        } as Segment;

        const response = this.policyConnectivityService.createOrReplaceInfraSegment({
            "path_segment-id": segmentName,
            "body_Segment": segment
        });

        validateResponse(response);

        return response.body;
    }

    public deleteSegmentById(segmentId: string): boolean {
        const response = this.policyConnectivityService.deleteInfraSegment({
            "path_segment-id": segmentId
        });

        validateResponse(response);

        return true;
    }

    public applyTagToSegment(segment: Segment, tags: Tag[]) {
        const response = this.policyConnectivityService.patchInfraSegmentWithForceTrue({
            "path_segment-id": segment.id,
            "body_Segment": {
                tags
            } as Segment
        } as PatchInfraSegmentWithForceTrueParameters);

        validateResponse(response);
    }

    public applyTagsToSegmentPort(segmentId: string, segmentPortId: string, segmentPortTags: Tag[]) {
        const patchInfraPayload = {
            "path_segment-id": segmentId,
            "path_port-id": segmentPortId,
            "body_SegmentPort": {
                tags: segmentPortTags
            }
        };

        this.logger.debug(`Set Segment Port tags request payload: ${stringify(patchInfraPayload)}`);
        const response = this.policyConnectivityService.patchInfraSegmentPort(patchInfraPayload);
        this.logger.debug(`Set tags to Segment port with ID '${segmentPortId}' response: ${stringify(response)}`);
        validateResponse(response);
        this.logger.info(`Segment Port tags: ${stringify(segmentPortTags)}`);
    }

    /**
     * Returns an array of Tags for mapping the SegmentPort to the specified SGs. All previous tags related to OpenStack SG IDs will be overridden.
     * @param segmentId Segment ID in NSX-T
     * @param segmentPortId Segment Port ID in NSX-T
     * @param openStackSecurityGroupIds Security Groups' IDs from OpenStack
     */
    public getSegPortTagsMappingToSecGroup(segmentId: string, segmentPortId: string, openStackSecurityGroupIds: string[]): Tag[] {
        const segmentResponse = this.policyConnectivityService.getInfraSegmentPort({
            "path_segment-id": segmentId,
            "path_port-id": segmentPortId
        });
        validateResponse(segmentResponse);
        const segment = segmentResponse.body;
        this.logger.debug(`Segment matched by OpenStack UUID tag from NSX-T: ${stringify(segment)}`);

        let segmentPortTags = segment.tags || [];
        // remove current tags mapping to SGs which will be recreated/overriden later on
        segmentPortTags = segmentPortTags.filter(tag => tag.scope != SEGMENT_PORT_TAG_SCOPE);

        openStackSecurityGroupIds.forEach(openStackSecurityGroupId => {
            segmentPortTags.push(
                {
                    tag: openStackSecurityGroupId, // OpenStack UUID for SG
                    scope: SEGMENT_PORT_TAG_SCOPE
                }
            )
        });

        return segmentPortTags;
    }

    public updateSegmentPortTags(nsxSegmentPortId: any) {
        this.logger.debug(`NSX-T segment port ID: ${nsxSegmentPortId}`);
    }
}
