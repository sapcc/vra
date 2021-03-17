# Overview

SAP One Strike vRealize Automation (vRA) and vRealize Orchestrator (vRO) artifacts for Openstack vRA Driver

## Installation

TBD

## Install Workflow Payload

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
