import React, { useContext, useEffect } from "react";
import axios from "axios";
import { SocketContext } from "./context/socket";
import { FBPageInfo } from "./App";

interface PagesInfoComponentProps {
  pagesInfo: FBPageInfo[];
  setPagesInfo: React.Dispatch<React.SetStateAction<FBPageInfo[]>>;
}

const PagesInfoComponent = ({
  pagesInfo,
  setPagesInfo,
}: PagesInfoComponentProps) => {
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on("pages", (pagesInfo: FBPageInfo[]) => {
      setPagesInfo(pagesInfo);
    });
    axios.get(`/api/facebook/${socket.id}/pages`);
  }, [socket, setPagesInfo]);

  return (
    <div>
      <h1>Pages</h1>
      <div>
        {pagesInfo.length > 0 &&
          pagesInfo.map((pageInfo) => {
            console.log(pageInfo);
            return (
              <ul key={`pageInfo-${pageInfo.id}`}>
                <li>Name: {pageInfo.name}</li>
                <li>Access Token: {pageInfo.accessToken}</li>
                <li>ID: {pageInfo.id}</li>
                {pageInfo.instagramAccount?.accountId && (
                  <li>
                    Instagram Account Id: {pageInfo.instagramAccount.accountId}
                  </li>
                )}
              </ul>
            );
          })}
      </div>
    </div>
  );
};

export default PagesInfoComponent;
