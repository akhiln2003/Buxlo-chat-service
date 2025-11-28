# Chat Service

This service handles real-time chat functionality for the BUXLO application. It uses Socket.IO for WebSocket communication, MongoDB for message storage, and Kafka for asynchronous events.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [WebSocket Events](#websocket-events)
- [Kafka Integration](#kafka-integration)
- [Running Tests](#running-tests)
- [Deployment](#deployment)

## Getting Started

### Prerequisites

- Node.js (v18)
- npm
- MongoDB
- Kafka
- AWS S3 Bucket

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/akhiln2003/Buxlo-chat-service.git
   ```
2. Navigate to the `chat` directory:
   ```bash
   cd Microservices/chat
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

## Usage

To start the service in development mode, run:

```bash
npm start
```

This will start the server using `ts-node-dev`.

## Environment Variables

This service requires the following environment variables to be set. You can create a `.env` file in the root of the `chat` directory and add the following:

| Variable                          | Description                               | Default Value                                                                            |
| --------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------- |
| `PORT`                            | The port the service will run on.         | `4004`                                                                                   |
| `MONGODB_URI`                     | The connection URI for the MongoDB database. | `mongodb+srv://<user>:<password>@buxlo.hpj5x.mongodb.net/Chat?retryWrites=true&w=majority&appName=Buxlo` |
| `AWS_S3_BUCKET_NAME`              | The name of the AWS S3 bucket.            | `buxlo-bucket`                                                                           |
| `AWS_S3_BUCKET_REGION`            | The region of the AWS S3 bucket.          | `eu-north-1`                                                                             |
| `AWS_S3_BUCKET_ACCESS_KEY`        | The access key for the AWS S3 bucket.     | `AKIA42PHHT2HQGKHIMFB`                                                                   |
| `AWS_S3_BUCKET_SECRET_ACCESS_KEY` | The secret access key for the AWS S3 bucket. | `REDACTED — set in .env`                                                |
| `KAFKA_CLIENT_ID`                 | The client ID for Kafka.                  | `chat-service`                                                                           |
| `KAFKA_BROKER`                    | The Kafka broker address.                 | `kafka:9092`                                                                             |
| `KAFKA_GROUP_ID`                  | The Kafka group ID.                       | `chat-group`                                                                             |
| `FRONT_END_BASE_URL`              | The base URL of the frontend application. | `http://localhost:5173`                                                                  |

## WebSocket Events

This service uses Socket.IO to handle real-time communication.
*(Detailed documentation of the WebSocket events should be added here)*

## Kafka Integration

This service uses Kafka for asynchronous communication. It acts as a producer and consumer.

## Running Tests

There are no test scripts configured for this service yet.

## Deployment

This service can be containerized using Docker. A `Dockerfile` is provided in the root of the `chat` directory.

To build the Docker image:

```bash
docker build -t chat-service .
```

To run the Docker container:

```bash
docker run -p 4004:4004 chat-service
```