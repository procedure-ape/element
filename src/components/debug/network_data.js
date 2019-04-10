let network = {
  "data": {
    "networkInfo": [{
      "status": "ACTIVE",
      "availability_zones": ["nova"],
      "name": "float-test",
      "admin_state_up": true,
      "is_router_external": false,
      "created_at": "2019-01-23T07:48:57Z",
      "update_at": "2019-01-23T07:48:57Z",
      "subnets_info": [{
        "cidr": "192.168.60.0/24",
        "name": "subnet-test01"
      }, {
        "cidr": "192.168.50.0/24",
        "name": "float-subnet"
      }],
      "is_default": null,
      "project_id": "8562c02c5bb74267b7231f008837ddd7",
      "qos_policy_id": null,
      "revision_number": 5,
      "port_security_enabled": true,
      "shared": true,
      "ipv4_address_scope_id": null,
      "mtu": 1500,
      "ipv6_address_scope_id": null,
      "id": "39f04238-c446-4d3f-8263-4bca2bcc915e",
      "description": ""
    }, {
      "status": "ACTIVE",
      "availability_zones": ["nova"],
      "name": "private",
      "admin_state_up": true,
      "is_router_external": false,
      "created_at": "2019-01-02T05:00:00Z",
      "update_at": "2019-01-02T05:00:00Z",
      "subnets_info": [{
        "cidr": "10.0.0.0/24",
        "name": "private_subnet"
      }],
      "is_default": null,
      "project_id": "3d1ed3961bd7449b9942c88e72ac31b6",
      "qos_policy_id": null,
      "revision_number": 3,
      "port_security_enabled": true,
      "shared": false,
      "ipv4_address_scope_id": null,
      "mtu": 1450,
      "ipv6_address_scope_id": null,
      "id": "3c0878e2-c278-4266-97a4-5f3e4aebf4b2",
      "description": ""
    }, {
      "status": "ACTIVE",
      "availability_zones": [],
      "name": "test01",
      "admin_state_up": true,
      "is_router_external": false,
      "created_at": "2019-01-28T08:56:49Z",
      "update_at": "2019-01-28T08:56:49Z",
      "subnets_info": [],
      "is_default": null,
      "project_id": "8562c02c5bb74267b7231f008837ddd7",
      "qos_policy_id": null,
      "revision_number": 2,
      "port_security_enabled": true,
      "shared": false,
      "ipv4_address_scope_id": null,
      "mtu": 1450,
      "ipv6_address_scope_id": null,
      "id": "4776d309-96c4-4abb-95ca-df28b1a2ad43",
      "description": ""
    }, {
      "status": "ACTIVE",
      "availability_zones": ["nova"],
      "name": "test-update01",
      "admin_state_up": false,
      "is_router_external": false,
      "created_at": "2019-01-16T00:28:11Z",
      "update_at": "2019-01-16T00:28:11Z",
      "subnets_info": [{
        "cidr": "192.168.10.0/24",
        "name": "subnet-test01"
      }],
      "is_default": null,
      "project_id": "8562c02c5bb74267b7231f008837ddd7",
      "qos_policy_id": null,
      "revision_number": 5,
      "port_security_enabled": true,
      "shared": true,
      "ipv4_address_scope_id": null,
      "mtu": 1450,
      "ipv6_address_scope_id": null,
      "id": "b4975930-1753-4454-99ce-a4adf3d88e31",
      "description": ""
    }, {
      "status": "ACTIVE",
      "availability_zones": ["nova"],
      "name": "public",
      "admin_state_up": true,
      "is_router_external": true,
      "created_at": "2019-01-02T04:59:52Z",
      "update_at": "2019-01-02T04:59:52Z",
      "subnets_info": [{
        "cidr": "172.24.4.0/24",
        "name": "public_subnet"
      }],
      "is_default": false,
      "project_id": "8562c02c5bb74267b7231f008837ddd7",
      "qos_policy_id": null,
      "revision_number": 6,
      "port_security_enabled": true,
      "shared": false,
      "ipv4_address_scope_id": null,
      "mtu": 1500,
      "ipv6_address_scope_id": null,
      "id": "b6f2abd5-06b0-4522-89a0-b13e2d1883f1",
      "description": ""
    }, {
      "status": "ACTIVE",
      "availability_zones": ["nova"],
      "name": "lck-test",
      "admin_state_up": true,
      "is_router_external": false,
      "created_at": "2019-01-02T07:26:32Z",
      "update_at": "2019-01-02T07:26:32Z",
      "subnets_info": [{
        "cidr": "192.168.0.0/24",
        "name": "subnet-test"
      }],
      "is_default": null,
      "project_id": "8562c02c5bb74267b7231f008837ddd7",
      "qos_policy_id": null,
      "revision_number": 3,
      "port_security_enabled": true,
      "shared": false,
      "ipv4_address_scope_id": null,
      "mtu": 1450,
      "ipv6_address_scope_id": null,
      "id": "e4f92645-fa30-4b92-a209-c04aa7bf1d79",
      "description": ""
    }]
  },
  "status": 200,
  "statusText": "OK",
  "headers": {
    "content-type": "application/json"
  },
  "config": {
    "transformRequest": {},
    "transformResponse": {},
    "timeout": 0,
    "xsrfCookieName": "XSRF-TOKEN",
    "xsrfHeaderName": "X-XSRF-TOKEN",
    "maxContentLength": -1,
    "headers": {
      "Accept": "application/json, text/plain, */*",
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest"
    },
    "method": "get",
    "url": "http://192.168.30.168:8000/network/listnetworks",
    "data": ""
  },
  "request": {}
}

export default {
  network
}
