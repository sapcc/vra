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
import { SegmentPort } from "com.vmware.pscoe.library.ts.nsxt.policy/models/SegmentPort";
import { Tag } from "com.vmware.pscoe.library.ts.nsxt.policy/models/Tag";
import { PolicyConnectivityService } from "com.vmware.pscoe.library.ts.nsxt.policy/services/PolicyConnectivityService";
import { SEGMENT_PORT_TAG_SCOPE } from "../constants";
import { stringify, validateResponse } from "../utils";
import { WaitForGetSegPortByAttachment } from "../utils/http/WaitForGetSegPortByAttachment";

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

    public listVlanSegmentsByVlanIds(vlanId: string): Segment[] {
        const response = this.httpClient.get(`policy/api/v1/search?query=vlan_ids:${vlanId} AND resource_type:segment`);

        return (response as any).results;
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

    public applyTagsToSegmentPort(segmentPort: SegmentPort, segmentPortTags: Tag[]) {
        segmentPort.tags = segmentPortTags;

        const parentPathArr = segmentPort.parent_path.split("/");
        const segmentId = parentPathArr[parentPathArr.length - 1];
        const segmentPortId = segmentPort.id;
        const patchInfraPayload = {
            "path_segment-id": segmentId,
            "path_port-id": segmentPortId,
            "body_SegmentPort": segmentPort
        };

        this.logger.debug(`Set Segment Port tags request payload: ${stringify(patchInfraPayload)}`);

        const response = this.policyConnectivityService.patchInfraSegmentPort(patchInfraPayload);

        this.logger.debug(`Set tags to Segment port with ID '${segmentPortId}' response: ${stringify(response)}`);

        validateResponse(response);

        this.logger.info(`Segment Port tags: ${stringify(segmentPortTags)}`);
    }

    /**
     * Returns an array of Tags for mapping the SegmentPort to the specified SGs. All previous tags related to OpenStack SG IDs will be overridden.
     * @param segment Segment in NSX-T
     * @param openStackSecurityGroupIds Security Groups' IDs from OpenStack
     */
    public getSegPortTagsMappingToSecGroup(segment: SegmentPort, openStackSecurityGroupIds: string[]): Tag[] {
        let segmentPortTags = segment.tags || [];
        // remove current tags mapping to SGs which will be recreated/overriden later on
        segmentPortTags = segmentPortTags.filter(tag => tag.scope !== SEGMENT_PORT_TAG_SCOPE);

        openStackSecurityGroupIds.forEach(openStackSecurityGroupId => {
            segmentPortTags.push(
                {
                    tag: openStackSecurityGroupId, // OpenStack UUID for SG
                    scope: SEGMENT_PORT_TAG_SCOPE
                }
            );
        });

        return segmentPortTags;
    }

    public getSegmentPort(segmentId: string, segmentPortId: string): SegmentPort {
        const segmentResponse = this.policyConnectivityService.getInfraSegmentPort({
            "path_segment-id": segmentId,
            "path_port-id": segmentPortId
        });

        validateResponse(segmentResponse);

        const segment: SegmentPort = segmentResponse.body;

        this.logger.debug(`Segment matched by OpenStack UUID tag from NSX-T: ${stringify(segment)}`);

        return segment;
    }

    public getSegmentPortByAttachment(segmentId: string, segmentPortAttachmentId: string,
        timeoutInSeconds: number, sleepTimeInSeconds: number): SegmentPort {
        const msg = `polling for SegmentPort with segment ID=${segmentId} and attachment ID=${segmentPortAttachmentId}`;

        // eslint-disable-next-line max-len
        this.logger.debug(`Started ${msg}. Polling details: max interval=${timeoutInSeconds}s; sleep time between requests=${sleepTimeInSeconds}s`);

        const getSegmentByAttachmentRequestTracker =
            new WaitForGetSegPortByAttachment(this.policyConnectivityService, segmentId, segmentPortAttachmentId);
        const segment: SegmentPort = getSegmentByAttachmentRequestTracker.get(timeoutInSeconds, sleepTimeInSeconds);

        this.logger.debug(`Finished ${msg}.`);

        if (!segment) {
            throw new Error(`No segment port found with attachment id = ${segmentPortAttachmentId}`);
        }

        this.logger.debug(`Segment matched by OpenStack UUID tag from NSX-T: ${stringify(segment)}`);

        return segment;
    }

}
