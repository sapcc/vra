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
import { CloneVolume } from "../../tasks/volume/CloneVolume";
import { GetExistingVolume } from "../../tasks/volume/GetExistingVolume";
import { WaitForVolume } from "../../tasks/volume/WaitForVolume";
import { CloneVolumeContext } from "../../types/volume/CloneVolumeContext";

@Workflow({
    name: "Clone Volume",
    path: "SAP/One Strike/Volume"
})
export class CloneVolumeWorkflow {
    public execute(name: string, existingName: string): void {
        const logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.workflows.volume/CloneVolumeWorkflow");
        const { timeoutInSeconds, sleepTimeInSeconds } =
            ConfigurationAccessor.loadConfig(PATHS.CONFIG, {} as Config);
        const initialContext: CloneVolumeContext = {
            newVolumeName: name,
            existingVolumeName: existingName,
            timeoutInSeconds,
            sleepTimeInSeconds
        };

        const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
        const PipelineBuilder = VROES.import("default").from("com.vmware.pscoe.library.pipeline.PipelineBuilder");
        const ExecutionStrategy = VROES.import("default").from("com.vmware.pscoe.library.pipeline.ExecutionStrategy");

        const pipeline = new PipelineBuilder()
            .name("Clone Volume")
            .context(initialContext)
            .stage("Get existing volume")
            .exec(
                GetExistingVolume
            )
            .done()
            .stage("Perform clone volume")
            .exec(
                CloneVolume,
                WaitForVolume
                //TagVolume
            )
            .done()
            .build();

        pipeline.process(ExecutionStrategy.TERMINATE);
    }
}
