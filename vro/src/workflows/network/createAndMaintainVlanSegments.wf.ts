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
import { PATHS } from "../../constants";
import { ConfigurationAccessor } from "../../elements/accessors/ConfigurationAccessor";
import { Config } from "../../elements/configs/Config.conf";
import { VlanSegment } from "../../elements/configs/VlanSegment.conf";
import { NsxtClientCreator } from "../../factories/creators/NsxtClientCreator";
import { NsxService } from "../../services/NsxService";
import { CreateVlanSegment } from "../../tasks/network/CreateVlanSegment";
import { GetFabricNetworksFromNetworkProfile } from "../../tasks/network/GetFabricNetworksFromNetworkProfile";
import { UpdateFabricNetworksInNetworkProfile } from "../../tasks/network/UpdateFabricNetworksInNetworkProfile";
import { WaitForFabricNetwork } from "../../tasks/network/WaitForFabricNetwork";
import { CreateAndMaintainVlanSegmentsContext } from "../../types/network/CreateAndMaintainVlanSegmentsContext";

const DEFAULT_SEGMENT_TAG = "pool";
const DEFAULT_VLAN_ID = "0";

@Workflow({
    name: "Create and Maintain Vlan Segments",
    path: "SAP/One Strike/Network"
})
export class CreateAndMaintainVlanSegmentsWorkflow {
    public execute(poolSize: number): void {
        const logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.workflows.network/CreateAndMaintainVlanSegmentsWorkflow");

        const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
        const PipelineBuilder = VROES.import("default").from("com.vmware.pscoe.library.pipeline.PipelineBuilder");
        const ExecutionStrategy = VROES.import("default").from("com.vmware.pscoe.library.pipeline.ExecutionStrategy");
        const { timeoutInSeconds, sleepTimeInSeconds } =
            ConfigurationAccessor.loadConfig(PATHS.CONFIG, {} as Config);
        const { transportZoneId, networkProfileId } =
            ConfigurationAccessor.loadConfig(PATHS.VLAN_SEGMENT, {} as VlanSegment);

        const nsxtService = new NsxService(NsxtClientCreator.build());
        const segments = nsxtService.listVlanSegmentsByVlanIds(DEFAULT_VLAN_ID);
        const topUp = poolSize - segments.length;

        for (let i = 0; i < topUp; i++) {
            const initialContext: CreateAndMaintainVlanSegmentsContext = {
                segmentName: `${DEFAULT_SEGMENT_TAG}-${System.nextUUID()}`,
                transportZoneId,
                vlanId: DEFAULT_VLAN_ID,
                networkProfileId,
                currentFabricNetworkIds: [],
                timeoutInSeconds,
                sleepTimeInSeconds
            };

            const pipeline = new PipelineBuilder()
                .name("Create and Maintain Vlan Segments")
                .context(initialContext)
                .stage("Create Vlan segment")
                .exec(
                    CreateVlanSegment
                )
                .done()
                .stage("Attach newly created Vlan segment to network profile")
                .exec(
                    WaitForFabricNetwork,
                    GetFabricNetworksFromNetworkProfile,
                    UpdateFabricNetworksInNetworkProfile
                )
                .done()
                .build();

            pipeline.process(ExecutionStrategy.TERMINATE);
        }
    }
}
