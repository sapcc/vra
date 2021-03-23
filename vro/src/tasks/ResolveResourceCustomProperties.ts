/*-
 * #%L
 * ccloud.vro
 * %%
 * Copyright (C) 2021 VMware&SAP
 * %%
 * SAP One Strike Openstack vRA adapter - vRA/vRO Artifacts
 * #L%
 */
import { DeploymentsService } from "com.vmware.pscoe.ts.vra.deployment/services/DeploymentsService";
import { VraClientCreator } from "../factories/creators/VraClientCreator";
import { UpdateNicsMacAddressesContext } from "../types/UpdateNicsMacAddressesContext";
import { validateResponse } from "../utils";

const VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES();
const Task = VROES.import("default").from("com.vmware.pscoe.library.pipeline.Task");

export class ResolveResourceCustomProperties extends Task {
    constructor(context: UpdateNicsMacAddressesContext) {
        super(context);
    }

    prepare() {
        // no-op
    }

    validate() {
        // no-op
    }

    execute() {
        const { deploymentId, resourceId } = this.context;
        const vraClientCreator = new VraClientCreator();
        const deploymentService = new DeploymentsService(vraClientCreator.createOperation());

        const response = deploymentService.getDeploymentResourcesUsingGET2({
            "path_depId": deploymentId
        });

        validateResponse(response);

        const { body: { content: resources } } = response;

        if (!resources.length) {
            throw Error(`No resources found for deployment id '${deploymentId}'!`);
        }

        const resource = resources.filter(({ id }) => id === resourceId)[0];

        if (!resource) {
            throw Error(`Cannot get resource! Reason: No resource found with id '${resourceId}'.`);
        }

        this.context.nicsMacAddresses = JSON.parse(resource.properties.nicsMacAddresses);
        this.context.instanceUUID = resource.properties.instanceUUID;
    }
}
