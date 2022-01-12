# POC messenger

## How to get set up

### Prerequisites

- [Install nvm](https://github.com/nvm-sh/nvm)
- Use node 16 lts
  ```
  $> nvm install 16
  $> nvm use 16
  ```
- Install pm2:
  ```
  yarn global add pm2
  ```

### How to get Started

- Copy the .env.sample and fill it with your environment variables
  ```
  cp .env.sample .env
  ```
- Install server dependencies:
  ```
  cd server
  yarn
  ```
- Install front dependencies:
  ```
  cd front
  yarn
  ```
- Launch at the root of the project:
  ```
  pm2 start
  ```

### Useful commands

- Kill application
  ```
  pm2 kill
  ```
- Stop application
  ```
  pm2 stop
  ```
- Start application
  ```
  pm2 start
  ```
- Tail Logs
  ```
  pm2 logs
  ```

### Setup your webhook

  In order for Facebook to be able to reach your machine in localhost, you can use ngrok to create a tunnel from a random public ip to your localhost:

- [Install ngrok and create an account](https://dashboard.ngrok.com/get-started/setup)
- Launch ngrok, the tunnel should forward to your server ip:port
  ```
  ngrok http 3001
  ```
- Fill your webhook configuration with the generated public ip from ngrok on https://developers.facebook.com/ to the app you want to test, Messenger/Settings section
- You can now receive messenger events from FB
