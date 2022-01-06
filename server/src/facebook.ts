import axios from "axios";
import getLogger, { LogLevel } from "./log";
import { SocketIOServerSocket } from "./socketio";
import appState from "./state";

const logDebug = getLogger("APP:FACEBOOK", LogLevel.DEBUG);
const logError = getLogger("APP:FACEBOOK");

export interface FBAccessTokenData {
  access_token: string;
  token_type: string;
}

export interface FBAccessTokenVerifInfo {
  app_id: string;
  type: string;
  application: string;
  data_access_expires_at: number;
  expires_at: number;
  is_valid: boolean;
  issued_at: number;
  scopes: string[];
  granular_scopes: { scope: string }[];
  user_id: string;
}

export const getUserAccessToken = (code: string) => {
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

export const getApplicationAccessToken = () => {
  const url = "https://graph.facebook.com/oauth/access_token";
  return axios.get(url, {
    params: {
      client_id: process.env.FACEBOOK_CLIENT_ID,
      client_secret: process.env.FACEBOOK_CLIENT_SECRET,
      grant_type: "client_credentials",
    },
  });
};

export const verifyAccessToken = async (
  appAccessToken: string,
  inputToken: string
) => {
  const url = "https://graph.facebook.com/debug_token";
  return axios.get(url, {
    params: { access_token: appAccessToken, input_token: inputToken },
  });
};

const getSocketIdFromFBState = (state: string): string | undefined => {
  const re = new RegExp("{socketId=(.*)}");
  const match = state.match(re);
  return match.length > 1 ? match[1] : undefined;
};

export const loadApplicationAuth = async () => {
  const { data }: { data: FBAccessTokenData } =
    await getApplicationAccessToken();
  appState.fbAccessToken = data.access_token;
};

export const handleFacebookAuth = async (
  code: string,
  state: string,
  socketio: SocketIOServerSocket
) => {
  const clientSocketId = getSocketIdFromFBState(state);
  if (clientSocketId) {
    try {
      const accessRes: { data: FBAccessTokenData } = await getUserAccessToken(
        code
      );
      // Load application access token
      await loadApplicationAuth();

      // Verify access token
      const verifRes: { data: { data: FBAccessTokenVerifInfo } } =
        await verifyAccessToken(
          appState.fbAccessToken,
          accessRes.data.access_token
        );

      // Fill client state associated with access token info
      socketio.state[clientSocketId] = {
        accessTokenInfo: {
          accessToken: accessRes.data.access_token,
          tokenType: accessRes.data.token_type,
          appId: verifRes.data.data.app_id,
          type: verifRes.data.data.type,
          application: verifRes.data.data.application,
          dataAccessExpiresAt: verifRes.data.data.data_access_expires_at,
          expiresAt: verifRes.data.data.expires_at,
          isValid: verifRes.data.data.is_valid,
          issuedAt: verifRes.data.data.issued_at,
          scopes: verifRes.data.data.scopes,
          granularScopes: verifRes.data.data.granular_scopes,
          userId: verifRes.data.data.user_id,
        },
      };

      // Send access token info to client
      socketio.io
        .to(clientSocketId)
        .emit("accessToken", socketio.state[clientSocketId].accessTokenInfo);
    } catch (e) {
      logError(e);
    }
  }
  // io.to(clientSocketId).emit("accessToken", {
  //   accessToken: res.data.access_token,
  // });
};
