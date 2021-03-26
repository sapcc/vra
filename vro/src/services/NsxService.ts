/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
import { HttpClient, HttpResponse } from "com.vmware.pscoe.library.ts.http/HttpClient";
import { Logger } from "com.vmware.pscoe.library.ts.logging/Logger";
import { Segment } from "com.vmware.pscoe.library.ts.nsxt.policy/models/Segment";
import { PolicyConnectivityService } from "com.vmware.pscoe.library.ts.nsxt.policy/services/PolicyConnectivityService";
import { validateResponse } from "../utils";

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
        const response = this.policyConnectivityService.deleteInfraSegment({ "path_segment-id": segmentId });

        validateResponse(response);

        return true;
    }

    public applyTagToSegment(segment: Segment) {
        const segmentSubnet = segment.subnets[0];

        const tag = [{
            scope: "128",
            tag: `segmentName:${segmentSubnet.gateway_address}`
        }];

        const response: HttpResponse = this.httpClient.request({
            path: `/policy/api/v1/infra/segments/${segment.id}?force=true`,
            method: "PATCH",
            contentType: "application/json",
            content: {
                tags: tag
            },
            headers: {}
        });

        validateResponse(response);

        return response.content;
    }
}
