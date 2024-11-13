# ADS-B RESTful Data Exchange - Broker

## Table of Contents

<!--toc:start-->

- [Building From Source](#building-from-source)
  - [Prerequisites](#prerequisites)
  - [Configuring Environment](#configuring-environment)
  - [Database Setup](#database-setup)
  - [Running](#running)

<!--toc:end-->

<!-- BUILDING FROM SOURCE -->

## Building from Source

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v20.11.1 or above)
- [PostgreSQL](https://www.postgresql.org/download/) (v14.13 or above)

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

ADSDB_USER=[db_username]
ADSDB_HOST=[db_hostname]
ADSDB_DB=[db_name]
ADSDB_PASSWORD=[db_password]
ADSDB_PORT=[db_port]
```

### Database Setup

1. Create database user: `createuser [USER]`
1. Create database: `createdb [DB_NAME]`
1. Create database tables: `psql -U [USER] -d [DB_NAME] -f src/database/adsb_table.sql`

### Running

1. Install dependencies: `npm install`
1. Run server: `npm start`
1. Broker server is available at `http://<hostname>:<PORT>`.
