---
id: responsiveness
title: Responsiveness
sidebar_label: Responsiveness
---

Recursively attempts to determine the responsiveness of the Docker service by calling internal APIs of the service. For example a database would be called with a trivial `SELECT` query.

The responsiveness healthcheck will fail once the responsivenessTimeout is reached.
