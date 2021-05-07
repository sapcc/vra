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
import { CreateVolumeFromSnapshot } from "../../tasks/volume/CreateVolumeFromSnapshot";
import { GetExistingVolume } from "../../tasks/volume/GetExistingVolume";
import { RetrieveVolumeSnapshotByName } from "../../tasks/volume/RetrieveVolumeSnapshotByName";
import { WaitForVolume } from "../../tasks/volume/WaitForVolume";
import { CreateVolumeFromSnapshotContext } from "../../types/volume/CreateVolumeFromSnapshotContext";

@Workflow({
    name: "Create Volume from Snapshot",
    path: "SAP/One Strike/Volume"
})
export class CreateVolumeFromSnapshotWorkflow {
    public execute(name: string, existingName: string, existingSnapshot: string): void {
        const logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.workflows.volume/CreateVolumeFromSnapshotWorkflow");
        const { timeoutInSeconds, sleepTimeInSeconds } =
            ConfigurationAccessor.loadConfig(PATHS.CONFIG, {} as Config);
        const initialContext: CreateVolumeFromSnapshotContext = {
            newVolumeName: name,
            existingVolumeName: existingName,
            snapshotName: existingSnapshot,
            sleepTimeInSeconds,
            timeoutInSeconds
        };

        const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
        const PipelineBuilder = VROES.import("default").from("com.vmware.pscoe.library.pipeline.PipelineBuilder");
        const ExecutionStrategy = VROES.import("default").from("com.vmware.pscoe.library.pipeline.ExecutionStrategy");

        const pipeline = new PipelineBuilder()
            .name("Create Volume from Snapshot")
            .context(initialContext)
            .stage("Get existing volume")
            .exec(
                GetExistingVolume,
                RetrieveVolumeSnapshotByName
            )
            .done()
            .stage("Perform create volume from snapshot")
            .exec(
                CreateVolumeFromSnapshot,
                WaitForVolume
            )
            .done()
            .build();

        pipeline.process(ExecutionStrategy.TERMINATE);
    }
}
