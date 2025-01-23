# ADS-B RESTful Data Exchange - User

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

- Copy the example environment from the user root:

```bash
cp .env.example dev.env
```

- Configure the `.env` with your credentials:

```.env
PORT=[user_server_port]
AUTH_URI[oauth_uri]

DB_URI=[mongo_uri]
```

### Running

1. Install dependencies: `npm install`
1. Run server: `npm start`
1. User server is available at `http://<hostname>:<PORT>`.
