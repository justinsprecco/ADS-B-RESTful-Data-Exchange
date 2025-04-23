# ADS-B RESTful Data Exchange - User

The User Service serves as a point of registration for users and ground stations. The purpose of this service  is to provide a client the capability to connect a ground station to the Data Exchange, allowing the Broker Service to process and distribute its data. Users will be able to then subscribe to live data streams and events determined in the Fuzzy Service.

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

- Copy the example environment from the user root:

```bash
cp .env.example dev.env
```

- Configure the `.env` with your credentials:

```.env
NODE_ENV="development"
PORT=[user_server_port]
AUTH_URI[oauth_uri]

DB_URI=[mongo_uri]
```

### Running

1. Install dependencies: `npm install`
1. Run server: `npm start`
1. User server is available at `http://<hostname>:<PORT>`.

<!-- API SPECIFICATION -->

## API Specification

The User Service exposes a documented RESTful interface.  
You can view the full OpenAPI specification below:

[📄 View OpenAPI Specification](./openapi.yaml)
