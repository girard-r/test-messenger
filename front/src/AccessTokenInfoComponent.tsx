import React from "react";
import { AccessTokenInfo } from "./App";

interface AccessTokenInfoComponentProps {
  accessTokenInfo: AccessTokenInfo;
}

const AccessTokenInfoComponent = ({
  accessTokenInfo,
}: AccessTokenInfoComponentProps) => {
  return (
    <div>
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
    </div>
  );
};

export default AccessTokenInfoComponent;
