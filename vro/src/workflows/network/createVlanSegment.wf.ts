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
import { Workflow } from "vrotsc-annotations";
import { NsxtClientCreator } from "../../factories/creators/NsxtClientCreator";
import { NsxService } from "../../services/NsxService";

@Workflow({
    name: "Create Vlan Segment",
    path: "SAP/One Strike/Network"
})
export class CreateVlanSegmentWorkflow {
    public execute(name: string, vlanId: string): void {
        const logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.workflows.network/CreateVlanSegmentWorkflow");

        const nsxService = new NsxService(NsxtClientCreator.build());

        const segment = nsxService.createVlanSegments(`${name}_vlanId`, "a95c914d-748d-497c-94ab-10d4647daeba", vlanId);

        const tags = [{
            scope: "openstack",
            tag: `openstack_id:${name}`
        }];
        
        nsxService.applyTagToSegment(segment, tags);
    }
}
