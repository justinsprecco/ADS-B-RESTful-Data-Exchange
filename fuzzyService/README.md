# ADS-B RESTful Data Exchange - Fuzzy

The Fuzzy Service is responsible for monitoring a stream of ADS-B and radar data, decoding the messages, and applying fuzzy logic algorithms to evaluate potential events, such as runway usage by an aircraft. The service will alert the Broker Service of these events, to forward to any subscribing users.

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

### Configuring Environment

- Copy the example environment from the fuzzy root:

```bash
cp .env.example dev.env
```

- Configure the `.env` with your credentials:

```.env
NODE_ENV="development"
BROKER_SOCKET_SERV="[broker-websocket-server]"
```

### Running

1. Install dependencies: `npm install`
1. Run server: `npm start`
