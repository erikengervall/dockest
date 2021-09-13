---
id: connectivity
title: Connectivity
sidebar_label: Connectivity
original_id: connectivity
---

Recursively attempts to establish a connection with the Docker service using the Node.js native
[net](https://nodejs.org/api/net.html#net_net_createconnection) module.

The connectivity healthcheck will fail once the connectionTimeout is reached.
