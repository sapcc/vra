/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { Logger } from "com.vmware.pscoe.library.ts.logging/Logger";
import { Workflow } from "vrotsc-annotations";
import { BaseContext } from "../../types/BaseContext";
import { stringify } from "../../utils";

@Workflow({
    name: "Attach Standalone Volume",
    path: "SAP/One Strike/Standalone Server"
})
export class AttachWorkflow {
    public execute(volumeId: string): void {
        const SingletonContextFactory = System.getModule("com.vmware.pscoe.library.context").SingletonContextFactory();

        const context: BaseContext = SingletonContextFactory.createLazy([
            "com.vmware.pscoe.library.context.workflow"
        ]);
        
        const logger = Logger.getLogger("Test");
        logger.info(`Context=${stringify(context)}`);
    }
}
