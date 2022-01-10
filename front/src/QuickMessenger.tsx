import React, { useContext, useEffect, useState } from "react";
import { FBPageInfo } from "./App";
import { SocketContext } from "./context/socket";

interface QuickMessengerProps {
  pagesInfo: FBPageInfo[];
}

interface QuickMessengerPerPageProps {
  pageInfo: FBPageInfo;
}

export interface MessageInfo {
  msgId: string;
  timestamp: number;
  text: string;
  senderId: string;
}

const QuickMessengerPerPage = ({ pageInfo }: QuickMessengerPerPageProps) => {
  const socket = useContext(SocketContext);
  const [lastMessage, setLastMessage] = useState<MessageInfo | null>(null);

  useEffect(() => {
    socket.on(`newMessage/${pageInfo.id}`, (message) => {
      setLastMessage(message);
    });
    return () => {
      socket.off(`newMessage/${pageInfo.id}`);
    };
  }, [socket, pageInfo]);

  return (
    <div>
      <div>{pageInfo.name}</div>
      <div>Last message received: {lastMessage?.text}</div>
      <div>Send: </div>
    </div>
  );
};

const QuickMessenger = ({ pagesInfo }: QuickMessengerProps) => {
  return (
    <div>
      <h1>Quick Messenger</h1>
      {pagesInfo.map((pageInfo, index) => {
        return (
          <QuickMessengerPerPage
            key={`per-page-${pageInfo.id}`}
            pageInfo={pageInfo}
          />
        );
      })}
    </div>
  );
};

export default QuickMessenger;
