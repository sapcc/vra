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
    "username": "administrator",
    "password": "VMware1!",
    "refreshToken": "",
    "projectID": "3782ae36-3990-414c-a465-7c00a57e92a5",
    "orgID": "5a20d68e-6a37-49e1-8c55-87995f179127"
  },
  "pscoeLogLevel": "debug"
}
```

## Install

```shell
./bin/installer environment.properties
```
