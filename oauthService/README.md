# ADS-B RESTful Data Exchange - Auth

The Auth Service serves as a security barrier, allowing users to verify their access to the data exchange. It acts as an intermediary between the User Service and the Broker Service, generating authentication tokens as verification.

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

- Copy the example environment from the oauth root:

```bash
cp .env.example dev.env
```

- Configure the `.env` with your credentials:

```.env
NODE_ENV="development"
PORT=[oauth_server_port]
AUTH_CODE_SECRET=[authCode_secret]
AUTH_TOKEN_SECRET=[authtoken_secret]
REFRESH_TOKEN_SECRET=[refreshToken_secret]

DB_URI=[mongo_uri]
```

### Running

1. Install dependencies: `npm install`
1. Run server: `npm start`
1. Auth server is available at `http://<hostname>:<PORT>`.

<!-- API SPECIFICATION -->

## API Specification

The Auth Service exposes a documented RESTful interface.  
You can view the full OpenAPI specification below:

[📄 View OpenAPI Specification](./openapi.yaml)
