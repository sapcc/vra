# Overview

SAP One Strike vRealize Automation (vRA) and vRealize Orchestrator (vRO) artifacts for Openstack vRA Driver

## Installation

TBD

## Install Workflow Payload

```json
{
  "timeoutInSeconds": 600,
  "sleepTimeInSeconds": 15,
  "vlanSegment": {
    "transportZoneId": "a95c914d-748d-497c-94ab-10d4647daeba",
    "networkProfileIds": ["fa5f5cd5-247d-4641-a004-62ecb5b4e8b3"],
    "cloudAccountId": "14e255a5-8c20-4471-8c41-a636bdc9ca0b
  },
  "endpoints": {
    "vra": {
      "hostname": "vra-l-01a.corp.local",
      "port": 443,
      "domain": "corp.local",
      "username": "configurationadmin",
      "password": "VMware1!",
      "refreshToken": "",
      "projectID": "e3a81308-d6cc-4125-ae3e-fdaa80f12e95",
      "orgID": "12c2d97b-d627-4a12-9fa2-4e8efb56bd57",
      "isPersistent": true
    },
    "nsxt": {
      "name": "NSX-T Rest Host",
      "url": "https://nsx-l-01a.corp.local",
      "authUserName": "admin",
      "authPassword": "VMware1!VMware1!",
      "ignoreWarnings": true,
      "hostVerification": false
    },
    "vcenter": {
      "name": "vCenter Rest Host",
      "url": "https://vc-l-01a.corp.local",
      "authUserName": "administrator@vsphere.local",
      "authPassword": "VMware1!"
    }
  },
  "pscoeLogLevel": "debug"
}
```

## Install

```shell
./bin/installer environment.properties
```
