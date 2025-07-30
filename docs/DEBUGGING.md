# Debugging Guide

This project includes a built-in debugging system for monitoring API and cache interactions. This guide explains how to enable and use these features.

## API & Cache Logging

To provide deep insight into the application's data flow, you can enable a verbose logging mode. When active, it will print detailed information to your browser's developer console for:

- **API Requests**: Logs the HTTP method, URL, and the payload for every outgoing request.
- **API Responses**: Logs the HTTP status, method, URL, and the full data received from the server.
- **API Errors**: Logs the details of any failed API request.
- **Cache Hits**: Logs the cache key and the data that was served directly from the client-side cache, helping you verify your caching strategy.

### How to Enable

1.  Create a new file named `.env.local` in the root of the project. If the file already exists, you can simply edit it.
2.  Add the following line to your `.env.local` file:

    ```env
    VITE_API_DEBUG_MODE=true
    ```

3.  Restart your development server.

The logs will now appear in your browser's console. To disable them, you can either set the value to `false` or remove the line from your `.env.local` file. 