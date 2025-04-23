# ADS-B RESTful Data Exchange - Broker

The Broker Service serves as the central communication in the data exchange, responsible for aggregating, processing, and distributing flight data from various ground stations. It connects with the Transponder Middleware and the MongoDB Database to provide live and historical flight information to subscribing clients. It will also listen for alerts from the Fuzzy Service for significant events.

## Table of Contents

<!--toc:start-->

- [Building From Source](#building-from-source)
  - [Prerequisites](#prerequisites)
  - [Configuring Environment](#configuring-environment)
  - [Running](#running)
- [API Specification](#api-specification)

<!--toc:end-->

<!-- BUILDING FROM SOURCE -->

## Building from Source

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v20.11.1 or above)
- [MongoDB](https://www.mongodb.com/try/download/community) (v8.0.4 or above)

### Configuring Environment

- Copy the example environment from the broker root:

```bash
cp .env.example dev.env
```

- Configure the `.env` with your credentials:

```.env
NODE_ENV="development"
PORT=[broker_server_port]
USER_SOCKET_PORT=[user_server_port]
USER_PROXY=[user_service_host]
AUTH_PROXY=[oauth_service_host]
BROKER_SECRET="[shared_auth_secret]"

DB_URI=[mongo_uri]
```

### Running

1. Install dependencies: `npm install`
1. Run server: `npm start`
1. Broker server is available at `http://<hostname>:<PORT>`.

<!-- API SPECIFICATION -->

## API Specification

The Broker Service exposes a documented RESTful interface.  
You can view the full OpenAPI specification below:

[📄 View OpenAPI Specification](./openapi.yaml)
