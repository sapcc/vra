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
import { Future } from "com.vmware.pscoe.library.ts.util/Future";

import { stringify } from "../../utils";

import { CANNOT_GET_SEG_PORT_BY_ATTACHMENT } from "../../constants";
import { PolicyConnectivityService } from "com.vmware.pscoe.library.ts.nsxt.policy/services/PolicyConnectivityService";
import { ListInfraSegmentPortsHttpResponse } from "com.vmware.pscoe.library.ts.nsxt.policy/models/ListInfraSegmentPortsHttpResponse";
import { SegmentPort } from "com.vmware.pscoe.library.ts.nsxt.policy/models/SegmentPort";

export class WaitForGetSegPortByAttachment extends Future<SegmentPort> {
	private readonly logger: Logger;

	constructor(private readonly service: PolicyConnectivityService, private readonly segmentId: string, private readonly segmentPortAttachmentId: string) {
		super();
		this.logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.utils.http/WaitForUpdateVolumeTags");
	}

	public toString(): string {
		return `Request params: segmentId=${stringify(this.segmentId)}; segmentPortAttachmentId=${this.segmentPortAttachmentId}`;
	}

	protected checkCompleted(): boolean {
		const response: ListInfraSegmentPortsHttpResponse = this.service.listInfraSegmentPorts(
            {
                "path_segment-id": this.segmentId
            }
        );

		if (response === undefined ||
			response.status === undefined) {
			this.error = new Error(`${CANNOT_GET_SEG_PORT_BY_ATTACHMENT} ${stringify(response)}`);
			this.logger.error(`${stringify(this.error)}`);
			return true;
		}

		switch (response.status) {
			case 200:
                const segment: SegmentPort = response.body.results.filter(seg =>
                    seg.attachment && seg.attachment.id && seg.attachment.id == this.segmentPortAttachmentId
                )[0];
                if (!segment) {
                    this.logger.debug(`No segment port found with attachment id = ${this.segmentPortAttachmentId}`);
                    return false;
                }

				this.value = segment;
                this.logger.debug(`Matched SegmentPort: ${stringify(this.value)}`);
				return true;
			default:
				this.logger.debug(`Response: ${stringify(response)}`);
				this.error = new Error(`${CANNOT_GET_SEG_PORT_BY_ATTACHMENT} Response status [${response.status}]`);
				return true;
        }
	}
}
