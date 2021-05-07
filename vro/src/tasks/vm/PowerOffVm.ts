/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
import { BaseVmContext } from "../../types/vm/BaseVmContext";
import { VmStateModification } from "./VmStateModification";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();

export class PowerOffVm extends VmStateModification {    
    constructor(context: BaseVmContext) {
        context.operation = "powerOffVM_Task";
        super(context);
    }
}
