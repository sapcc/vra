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
import { DEFAULT_VLAN_ID, PATHS } from "../../constants";
import { ConfigurationAccessor } from "../../elements/accessors/ConfigurationAccessor";
import { VlanSegment } from "../../elements/configs/VlanSegment.conf";
import { NsxtClientCreator } from "../../factories/creators/NsxtClientCreator";
import { NsxService } from "../../services/NsxService";
import { CreateVlanSegment } from "../../tasks/network/CreateVlanSegment";
import { CreateAndMaintainVlanSegmentsContext } from "../../types/network/CreateAndMaintainVlanSegmentsContext";

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
        
        const { transportZoneId } = ConfigurationAccessor.loadConfig(PATHS.VLAN_SEGMENT_CONFIG, {} as VlanSegment);
        const nsxtService = new NsxService(NsxtClientCreator.build());
        const segments = nsxtService.listDefaultVlansPool();
        const topUp = poolSize - segments.length;

        logger.info("Starting create and maintain vlan segments workflow ...");

        logger.info(`Current segments count: ${segments.length}.`);
        logger.info(`Top up segments count: ${topUp}.`);

        if (poolSize <= 0) {
            throw new Error("'poolSize' should be positive and non-zero value.");
        } else if (topUp <= 0) {
            throw new Error("'topUp' should be greater than zero.");
        }

        const initialContext: CreateAndMaintainVlanSegmentsContext = {
            topUp,
            transportZoneId,
            vlanId: DEFAULT_VLAN_ID
        };

        const pipeline = new PipelineBuilder()
            .name("Create and Maintain Vlan Segment.")
            .context(initialContext)
            .stage("Create Vlan segment")
            .exec(
                CreateVlanSegment
            )
            .done()
            .build();

        pipeline.process(ExecutionStrategy.TERMINATE);

        logger.info("Finished create and maintain vlan segments workflow.");
    }
}
