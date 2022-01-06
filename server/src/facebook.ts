import axios from "axios";

export const getAccessToken = (code: string) => {
  const url = "https://graph.facebook.com/v12.0/oauth/access_token";
  return axios.get(url, {
    params: {
      client_id: process.env.FACEBOOK_CLIENT_ID,
      client_secret: process.env.FACEBOOK_CLIENT_SECRET,
      redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
      code,
    },
  });
};
