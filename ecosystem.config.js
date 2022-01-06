require("dotenv").config();

module.exports = {
  apps: [
    {
      name: "front",
      script: "yarn start",
      cwd: "./front",
      env: {
        PORT: process.env.REACT_APP_PORT,
        REACT_APP_FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
        REACT_APP_FACEBOOK_REDIRECT_URI: process.env.FACEBOOK_REDIRECT_URI
      }
    },
    {
      name: "server",
      script: process.env.NODE_ENV === "production" ? "yarn start" : "yarn dev",
      cwd: "./server",
      env: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        DEBUG: process.env.DEBUG,
        DEBUG_COLORS: process.env.DEBUG_COLORS,
        FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
        FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
        FACEBOOK_REDIRECT_URI: process.env.FACEBOOK_REDIRECT_URI
      },
    },
  ],
};
