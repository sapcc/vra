# Overview
TODO: overview brief

# Installation
### 1. bamboo-casc
#### Navigate to your bamboo server (e.g. https://bamboo.pscoe.vmware.com/):
- create a linked repository

#### Navigate to ./bamboo-specs/pom.xml and provide:
- groupId
- artifactId

#### Navigate to ./bamboo-specs/src/main/resources/bamboo.properties and provide:
- project.name
- plan.name
- linkedRepository.name

#### Navigate to ./bamboo-specs/src/main/java/com/vmware/pscoe/BambooConfiguration.java:
- choose project plan by editing the file, choosing between MixedPlan, JsPlan or XmlPlan

#### Navigate to ./bamboo-specs/.credentials:
- provide bamboo user and password 

#### Navigate to ./bamboo-specs and run:
- 'mvn test' to perform offline validation of the plan
- 'mvn -Ppublish-specs' to upload the plan to your Bamboo server


# DevEnv
### 1. kickstart script
- place kistart.sh kickstart.yml (ansible) or kickstart.pyy inside the dev dir
- edit hatchery release file on your hatchery  to  enable  autoamtic on-boot execution of your scripts 
