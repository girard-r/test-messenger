import React, { useState } from "react";
import FacebookConnect from "./FacebookConnect";
import { socket, SocketContext } from "./context/socket";
import AccessTokenInfoComponent from "./AccessTokenInfoComponent";
import PagesInfoComponent from "./PagesInfoComponent";
import QuickMessenger from "./QuickMessenger";

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

export interface InstagramAccount {
  accountId: string;
}

export interface FBPageInfo {
  accessToken: string;
  id: string;
  name: string;
  instagramAccount?: InstagramAccount;
}

const App = () => {
  const [accessTokenInfo, setAccessTokenInfo] =
    useState<AccessTokenInfo | null>(null);
  const [pagesInfo, setPagesInfo] = useState<FBPageInfo[]>([]);
  return (
    <div>
      <SocketContext.Provider value={socket}>
        <FacebookConnect setAccessTokenInfo={setAccessTokenInfo} />
        {!!accessTokenInfo && (
          <>
            <AccessTokenInfoComponent accessTokenInfo={accessTokenInfo} />
            <PagesInfoComponent
              pagesInfo={pagesInfo}
              setPagesInfo={setPagesInfo}
            />
            <QuickMessenger pagesInfo={pagesInfo} />
          </>
        )}
      </SocketContext.Provider>
    </div>
  );
};

export default App;
