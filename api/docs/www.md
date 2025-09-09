# Server Bootstrap (`bin/www`)

This file is the main entry point for starting the Express server. It is responsible for:

- Loading environment variables
- Normalizing and setting the port
- Creating the HTTP server with the Express app
- Binding server events for error handling, logging, and graceful shutdown
- Handling OS signals for clean process termination

## Key Concepts

### Server Object
The `server` object is an instance of Node.js's `http.Server`. It manages HTTP connections and delegates requests to your Express application.

### Process Object
The global `process` object represents the running Node.js process. It is used to handle system signals (like `SIGINT` and `SIGTERM`) for graceful shutdown.

## Lifecycle Overview

1. **Environment Setup:** Loads configuration from `.env` and normalizes the port.
2. **Server Creation:** Instantiates the HTTP server using your Express app.
3. **Event Binding:** Attaches handlers for server events (`error`, `clientError`, `listening`, `close`).
4. **Signal Handling:** Listens for termination signals to trigger graceful shutdown.
5. **Graceful Shutdown:** Ensures all connections are closed before exiting, with a timeout fallback.

## Why Separate This File?

Keeping server bootstrap logic in `bin/www` keeps your application code focused on routing and business logic, while `bin/www` manages the server lifecycle and system integration.
