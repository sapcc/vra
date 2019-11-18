package com.vmware.pscoe;

import com.atlassian.bamboo.specs.api.BambooSpec;
import com.atlassian.bamboo.specs.api.builders.permission.PermissionType;
import com.atlassian.bamboo.specs.api.builders.permission.Permissions;
import com.atlassian.bamboo.specs.api.builders.permission.PlanPermissions;
import com.atlassian.bamboo.specs.api.builders.plan.Plan;
import com.atlassian.bamboo.specs.api.builders.plan.PlanIdentifier;
import com.atlassian.bamboo.specs.util.BambooServer;
import com.vmware.pscoe.builder.plan.*;
import com.vmware.pscoe.properties.BambooProperties;

@BambooSpec
public class BambooConfiguration {

    private static final String BAMBOO_PROPERTIES_PATH = "/bamboo.properties";
    private static final String BAMBOO_URL = "bamboo.url";
    private static final String PROJECT_NAME = "project.name";
    private static final String PLAN_NAME = "plan.name";
    private static final String LINKED_REPOSITORY_NAME = "linkedRepository.name";

    public static void main(String[] args) throws Exception {

        BambooProperties bambooProperties = new BambooProperties(BAMBOO_PROPERTIES_PATH);
        BambooServer bambooServer = new BambooServer(bambooProperties.getValue(BAMBOO_URL));

        // Choose between JsPlan, XmlPlan or MixedPlan
        Plan bambooPlan = new JsPlan()
                .setProject(bambooProperties.getValue(PROJECT_NAME))
                .setPlan(bambooProperties.getValue(PLAN_NAME))
                .setRepo(bambooProperties.getValue(LINKED_REPOSITORY_NAME))
                .addTasks()
                .createPlan();

        bambooServer.publish(bambooPlan);
        PlanPermissions planPermission = new BambooConfiguration().createPlanPermission(bambooPlan.getIdentifier());
        bambooServer.publish(planPermission);

    }

    private PlanPermissions createPlanPermission(PlanIdentifier planIdentifier) {
        Permissions permission = new Permissions()
                .groupPermissions("bamboo-user", PermissionType.BUILD, PermissionType.CLONE, PermissionType.VIEW,
                        PermissionType.EDIT, PermissionType.ADMIN)
                .loggedInUserPermissions(PermissionType.VIEW).anonymousUserPermissionView();

        return new PlanPermissions(planIdentifier.getProjectKey(), planIdentifier.getPlanKey()).permissions(permission);
    }

}

