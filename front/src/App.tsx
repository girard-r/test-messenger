import React, { useState } from "react";
import FacebookConnect from "./FacebookConnect";
import { socket, SocketContext } from "./context/socket";
import AccessTokenInfoComponent from "./AccessTokenInfoComponent";

export interface AccessTokenInfo {
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

const App = () => {
  const [accessTokenInfo, setAccessTokenInfo] =
    useState<AccessTokenInfo | null>(null);
  return (
    <div>
      <SocketContext.Provider value={socket}>
        <FacebookConnect setAccessTokenInfo={setAccessTokenInfo} />
        {!!accessTokenInfo && (
          <AccessTokenInfoComponent accessTokenInfo={accessTokenInfo} />
        )}
      </SocketContext.Provider>
    </div>
  );
};

export default App;
