import React, { useState, useContext, useEffect } from "react";
import NewWindow from "react-new-window";
import { SocketContext } from "./context/socket";

interface AccessTokenInfo {
  accessToken: string;
  tokenType: string;
  appId: string;
  type: string;
  application: string;
  dataAccessExpiresAt: number;
  expiresAt: number;
  isValid: boolean;
  issuedAt: number;
  scopes: string[];
  granularScopes: { scope: string }[];
  userId: string;
}

const FacebookConnect = () => {
  const SCOPES_TO_ASK =
    "business_management,pages_show_list,email,pages_read_user_content,pages_manage_engagement,pages_read_engagement,pages_manage_metadata,pages_messaging";
  const [hidden, setHidden] = useState<boolean>(true);
  const [accessTokenInfo, setAccessTokenInfo] =
    useState<AccessTokenInfo | null>(null);
  const socket = useContext(SocketContext);

  const showWindow = () => {
    setHidden(false);
  };

  const hideWindow = () => {
    setHidden(true);
  };

  useEffect(() => {
    socket.on("accessToken", (accessTokenInfo) => {
      setAccessTokenInfo(accessTokenInfo);
    });
    return () => {
      socket.off("accessToken");
    };
  }, [socket]);

  return (
    <div className="App">
      {!hidden && (
        <NewWindow
          url={`https://www.facebook.com/v12.0/dialog/oauth?client_id=${process.env.REACT_APP_FACEBOOK_CLIENT_ID}&display=popup&redirect_uri=${process.env.REACT_APP_FACEBOOK_REDIRECT_URI}&state={socketId=${socket.id}}&response_type=code,granted_scopes&scope=${SCOPES_TO_ASK}`}
          onUnload={hideWindow}
        />
      )}
      <button onClick={showWindow}>Connect to Facebook</button>
      {accessTokenInfo && (
        <ul>
          <li>Access Token: {accessTokenInfo.accessToken}</li>
          <li>Token Type: {accessTokenInfo.tokenType}</li>
          <li>App Id: {accessTokenInfo.appId}</li>
          <li>Application: {accessTokenInfo.application}</li>
          <li>Type: {accessTokenInfo.type}</li>
          <li>Data Access Expires At: {accessTokenInfo.dataAccessExpiresAt}</li>
          <li>
            Expires At:{" "}
            {new Date(accessTokenInfo.expiresAt * 1000).toLocaleString()}
          </li>
          <li>Is Valid: {accessTokenInfo.isValid ? "true" : "false"}</li>
          <li>
            Issued At:{" "}
            {new Date(accessTokenInfo.issuedAt * 1000).toLocaleString()}
          </li>
          <li>User ID: {accessTokenInfo.userId}</li>
          <li>
            Scopes:
            <ul>
              {accessTokenInfo.scopes.map((scope) => {
                return <li key={scope}>{scope}</li>;
              })}
            </ul>
          </li>
          <li>
            Granular Scopes:
            <ul>
              {accessTokenInfo.granularScopes.map((scopeObject) => {
                return (
                  <li key={scopeObject.scope + "-granular"}>
                    scope: {scopeObject.scope}
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      )}
    </div>
  );
};

export default FacebookConnect;
