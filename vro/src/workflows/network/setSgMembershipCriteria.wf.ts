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
import { PolicyService } from "com.vmware.pscoe.library.ts.nsxt.policy/services/PolicyService";
import { SecurityGroupsService } from "com.vmware.pscoe.ts.vra.iaas/services/SecurityGroupsService";
import { In, Workflow } from "vrotsc-annotations";
import { DOMAIN_ID, SEGMENT_PORT_TAG_VALUE } from "../../constants";
import { NsxtClientCreator } from "../../factories/creators/NsxtClientCreator";
import { VraClientCreator } from "../../factories/creators/VraClientCreator";
import { BaseContext } from "../../types/BaseContext";
import { stringify, validateResponse } from "../../utils";

@Workflow({
    id: "7721de97-a5c2-4af1-ad86-f6626533d82b",
    name: "Set Security Group Membership Criteria",
    path: "SAP/One Strike/Security Group",
    input: {
        inputProperties: { type: "Properties" }
    }
})
export class SetSecurityGroupMembershipCriteria {

    public execute(@In inputProperties: Properties): void {
        const SingletonContextFactory = System.getModule("com.vmware.pscoe.library.context").SingletonContextFactory();
        const context: BaseContext = SingletonContextFactory.createLazy([
            "com.vmware.pscoe.library.context.workflow"
        ]);
        const logger = Logger.getLogger("com.vmware.pscoe.sap.ccloud.vro.workflows.network/setSgMembershipCriteria");
        logger.info(`Context=${stringify(context)}`);
        const deploymentId = inputProperties.deploymentId;
        if (!deploymentId) {
            throw Error("Missing deployment ID!");
        }
        logger.debug(`Deployment ID: ${deploymentId}`);

        const vraClientCreator = new VraClientCreator();
        const securityGroupService = new SecurityGroupsService(vraClientCreator.createOperation());
        const securityGroup = securityGroupService.getSecurityGroups().body.content.filter(sg => sg.deploymentId === deploymentId)[0];
        if (!securityGroup) {
            throw new Error(`No Security group found for deployment with ID '${deploymentId}'!`);
        }

        const segmentPortTagKey = inputProperties.customProperties.securityGroupId; // OpenStack UUID for SG
        const patchInfraPayload = {
            body_Infra: {
                resource_type: "Infra",
                children: [
                    {
                        resource_type: "ChildDomain",
                        marked_for_delete: false,
                        Domain: {
                            id: DOMAIN_ID,
                            resource_type: "Domain",
                            marked_for_delete: false,
                            children: [
                                {
                                    resource_type: "ChildGroup",
                                    Group: {
                                        resource_type: "Group",
                                        id: securityGroup.externalId,
                                        description: securityGroup.description,
                                        display_name: securityGroup.name,
                                        expression: [
                                            {
                                                value: `${SEGMENT_PORT_TAG_VALUE}|${segmentPortTagKey}`,
                                                member_type: "SegmentPort",
                                                key: "Tag",
                                                operator: "EQUALS",
                                                resource_type: "Condition"
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        };

        logger.debug(`Patch infra request payload: ${stringify(patchInfraPayload)}`);
        const policyService = new PolicyService(NsxtClientCreator.build());
        const response = policyService.patchInfra(patchInfraPayload);
        logger.debug(`Add membership criteria to Security group with ID '${securityGroup.id}' response: ${stringify(response)}`);
        validateResponse(response);
        logger.info("Added membership criteria to Security group.");
    }
    
}
