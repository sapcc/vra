/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
import { Workflow } from "vrotsc-annotations";

@Workflow({
    name: "Detach Standalone Volume",
    path: "SAP/One Strike/Standalone Server"
})
export class DetachWorkflow {
    public execute(): void {
        // no-op
    }
}
