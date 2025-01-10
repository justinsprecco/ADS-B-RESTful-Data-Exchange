# ADS-B RESTful Data Exchange - OAuth

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

- Copy the example environment from the oauth root:

```bash
cp .env.example dev.env
```

- Configure the `.env` with your credentials:

```.env
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
