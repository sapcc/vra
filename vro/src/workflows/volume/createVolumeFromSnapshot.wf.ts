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
import { CreateVolumeFromSnapshot } from "../../tasks/volume/CreateVolumeFromSnapshot";
import { GetExistingVolume } from "../../tasks/volume/GetExistingVolume";
import { WaitForVolume } from "../../tasks/volume/WaitForVolume";
import { CreateVolumeFromSnapshotContext } from "../../types/volume/CreateVolumeFromSnapshotContext";

@Workflow({
    name: "Create Volume from Snapshot",
    path: "SAP/One Strike/Volume"
})
export class CreateVolumeFromSnapshotWorkflow {
    public execute(name: string, existingName: string, existingSnapshot: string): void {
        const logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.workflows.volume/CreateVolumeFromSnapshotWorkflow");

        const initialContext: CreateVolumeFromSnapshotContext = {
            existingVolumeName: existingName,
            // TODO: promote to new general config
            timeoutInSeconds: 60 * 15,
            sleepTimeInSeconds: 15,
            newVolumeName: name,
            snapshotId: existingSnapshot
        };
        
        const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
        const PipelineBuilder = VROES.import("default").from("com.vmware.pscoe.library.pipeline.PipelineBuilder");
        const ExecutionStrategy = VROES.import("default").from("com.vmware.pscoe.library.pipeline.ExecutionStrategy");

        const pipeline = new PipelineBuilder()
            .name("Create Volume From Snapshot")
            .context(initialContext)
            .stage("Get existing Volume")
            .exec(
                GetExistingVolume
            )
            .done()
            .stage("Perform create volume from snapshot")
            .exec(
                CreateVolumeFromSnapshot,
                WaitForVolume
                //TagVolume
            )
            .done()
            .build();

        pipeline.process(ExecutionStrategy.TERMINATE);
    }
}
