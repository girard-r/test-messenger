import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { SocketContext } from "./context/socket";

export interface FBPagesInfo {
  accessToken: string;
  id: string;
  name: string;
}

const PagesInfoComponent = () => {
  const socket = useContext(SocketContext);
  const [pagesInfo, setPagesInfo] = useState<FBPagesInfo[]>([]);

  useEffect(() => {
    socket.on("pages", (pagesInfo: FBPagesInfo[]) => {
      console.log(pagesInfo);
      setPagesInfo(pagesInfo);
    });
    axios.get(`/api/facebook/${socket.id}/pages`);
  }, [socket]);

  return (
    <div>
      <h1>Pages</h1>
      <div>
        {pagesInfo.length > 0 &&
          pagesInfo.map((pageInfo) => {
            return (
              <ul key={`pageInfo-${pageInfo.id}`}>
                <li>Name: {pageInfo.name}</li>
                <li>Access Token: {pageInfo.accessToken}</li>
                <li>ID: {pageInfo.id}</li>
              </ul>
            );
          })}
      </div>
    </div>
  );
};

export default PagesInfoComponent;
