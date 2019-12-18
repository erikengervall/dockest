---
id: version-1.0.4-responsiveness
title: Responsiveness
sidebar_label: Responsiveness
original_id: responsiveness
---

Recursively attempts to determine the responsiveness of the Docker service by calling internal APIs of the service. For example a database would be called with a trivial `SELECT` query.

The responsiveness healthcheck will fail once the responsivenessTimeout is reached.
