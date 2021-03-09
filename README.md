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

## Payload

```json
{
  "vra": {
    "hostname": "vra-l-01a.corp.local",
    "port": 443,
    "domain": "corp.local",
    "username": "configurationadmin",
    "password": "VMware1!",
    "refreshToken": "",
    "projectID": "e3a81308-d6cc-4125-ae3e-fdaa80f12e95",
    "orgID": "12c2d97b-d627-4a12-9fa2-4e8efb56bd57"
  },
  "pscoeLogLevel": "debug"
}
```

## Install

```shell
./bin/installer environment.properties
```
