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
import { GetNetworkProfileParameters } from "com.vmware.pscoe.ts.vra.iaas/models/GetNetworkProfileParameters";
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

        // TODO: CreateVlanSegment
        const nsxService = new NsxService(NsxtClientCreator.build());

        logger.info("Creating Vlan segment ...");
        const segment = nsxService.createVlanSegments(`${name}_vlanId`, "a95c914d-748d-497c-94ab-10d4647daeba", vlanId);
        logger.info(`Created Vlan segment:\n${stringify(segment)}`);

        // TODO: TagVlanSegment
        const tags = [{
            scope: "openstack",
            tag: `openstack_id:${name}`
        }];

        nsxService.applyTagToSegment(segment, tags);
        logger.info("Tagged Vlan segment.");

        // TODO: WaitForFabricNetwork
        logger.info("Waiting for Vlan segment to be collected in vRA ...");
        const vraClientCreator = new VraClientCreator();
        const execution = new WaitForFabricNetwork(new FabricNetworksService(vraClientCreator.createOperation()), `${name}_vlanId`);

        const response = execution.get(10 * 60, 15);
        logger.info(`Found Fabric Network:\n${stringify(response)}`);

        // TODO: AddFabricNetworkToNetworkProfile

        // TODO: GetFabricNetworksFromNetworkProfile
        const networkProfileService = new NetworkProfilesService(vraClientCreator.createOperation());

        const networkProfile = networkProfileService.getNetworkProfile({
            path_id: "fa5f5cd5-247d-4641-a004-62ecb5b4e8b3"
        } as GetNetworkProfileParameters).body;

        logger.info(`Network Profile:\n${stringify(networkProfile)}`);

        let fabricNetworksIds = [];

        if (networkProfile._links["fabric-networks"]) {
            fabricNetworksIds = networkProfile._links["fabric-networks"]
                .hrefs
                // Example HREF to fabric network - "/iaas/api/fabric-networks/f199daf4-001e-40bd-935b-86560f729a61"
                .map(href => href.split("/")[4]);
        }

        logger.info(`fabricNetworksIds:\n${stringify(fabricNetworksIds)}`);

        // TODO: UpdateFabricNetworksInNetworkProfile
        networkProfileService.updateNetworkProfile({
            path_id: "fa5f5cd5-247d-4641-a004-62ecb5b4e8b3",
            body_body: {
                fabricNetworkIds: [response.body.content[0].id, ...fabricNetworksIds]
            } as NetworkProfileSpecification
        } as UpdateNetworkProfileParameters);
        
        logger.info("Added Fabric Network to Network Profile.");
    }
}
