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
import { NetworkProfileSpecification } from "com.vmware.pscoe.ts.vra.iaas/models/NetworkProfileSpecification";
import { UpdateNetworkProfileParameters } from "com.vmware.pscoe.ts.vra.iaas/models/UpdateNetworkProfileParameters";
import { FabricNetworksService } from "com.vmware.pscoe.ts.vra.iaas/services/FabricNetworksService";
import { NetworkProfilesService } from "com.vmware.pscoe.ts.vra.iaas/services/NetworkProfilesService";
import { Workflow } from "vrotsc-annotations";
import { NsxtClientCreator } from "../../factories/creators/NsxtClientCreator";
import { VraClientCreator } from "../../factories/creators/VraClientCreator";
import { NsxService } from "../../services/NsxService";
import { stringify } from "../../utils";
import { WaitForFabricNetwork } from "./WaitForFabricNetwork";

@Workflow({
    name: "Create Vlan Segment",
    path: "SAP/One Strike/Network"
})
export class CreateVlanSegmentWorkflow {
    public execute(name: string, vlanId: string): void {
        const logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.workflows.network/CreateVlanSegmentWorkflow");

        const nsxService = new NsxService(NsxtClientCreator.build());

        logger.info("Creating Vlan segment ...");
        const segment = nsxService.createVlanSegments(`${name}_vlanId`, "a95c914d-748d-497c-94ab-10d4647daeba", vlanId);
        logger.info(`Created Vlan Segment:\n${stringify(segment)}`);

        const tags = [{
            scope: "openstack",
            tag: `openstack_id:${name}`
        }];

        nsxService.applyTagToSegment(segment, tags);
        logger.info("Tag Vlan segment ...");

        logger.info("Waiting for Vlan segment to be collected in vRA ...");
        const vraClientCreator = new VraClientCreator();
        const execution = new WaitForFabricNetwork(new FabricNetworksService(vraClientCreator.createOperation()), `${name}_vlanId`);

        const response = execution.get(10 * 60, 15);
        logger.info(`Found Fabric Network:\n${stringify(response)}`);

        const networkProfileService = new NetworkProfilesService(vraClientCreator.createOperation());

        // const networkProfile = networkProfileService.getNetworkProfile({
        //     path_id: "dced940b-7280-459c-913b-ab9e7b3fc882"
        // } as GetNetworkProfileParameters).body;

        networkProfileService.updateNetworkProfile({
            path_id: "dced940b-7280-459c-913b-ab9e7b3fc882",
            body_body: {
                fabricNetworkIds: [response.body.content[0].id]
            } as NetworkProfileSpecification
        } as UpdateNetworkProfileParameters);

    }
}
