# ADS-B RESTful Data Exchange - Broker

## Table of Contents

<!--toc:start-->

- [Building From Source](#building-from-source)
  - [Prerequisites](#prerequisites)
  - [Configuring Environment](#configuring-environment)
  - [Running](#running)

<!--toc:end-->

<!-- BUILDING FROM SOURCE -->

## Building from Source

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v20.11.1 or above)
- [MongoDB](https://www.mongodb.com/try/download/community) (v8.0.4 or above)

Begin by cloning the repo:

```bash
git clone https://git.sagetech.com/wsu-captsone/ads-b-restful-data-exchange.git
```

### Configuring Environment

- Copy the example environment from the broker root:

```bash
cp .env.example dev.env
```

- Configure the `.env` with your credentials:

```.env
PORT=[broker_server_port]
USER_SOCKET_PORT=[user_server_port]
USER_PROXY=[user_service_host]
AUTH_PROXY=[oauth_service_host]

DB_URI=[mongo_uri]
```

### Running

1. Install dependencies: `npm install`
1. Run server: `npm start`
1. Broker server is available at `http://<hostname>:<PORT>`.
