import React, { useContext, useEffect, useState } from "react";
import { FBPageInfo } from "./App";
import { SocketContext } from "./context/socket";
import { useForm } from "react-hook-form";
import axios from "axios";

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
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    socket.on(`newMessage/${pageInfo.id}`, (message) => {
      setLastMessage(message);
    });
    if (pageInfo.instagramAccount?.accountId) {
      socket.on(
        `newMessage/${pageInfo.instagramAccount?.accountId}`,
        (message) => {
          setLastMessage(message);
        }
      );
    }
    return () => {
      socket.off(`newMessage/${pageInfo.id}`);
      if (pageInfo.instagramAccount?.accountId) {
        socket.off(`newMessage/${pageInfo.instagramAccount?.accountId}`);
      }
    };
  }, [socket, pageInfo]);

  const onSubmit =
    (pageAccessToken: string, recipientId: string) =>
    ({ message }: { message: string }) => {
      axios
        .post(
          "https://graph.facebook.com/v12.0/me/messages",
          {
            messaging_type: "RESPONSE",
            recipient: {
              id: recipientId,
            },
            message: {
              text: message,
            },
          },
          {
            params: { access_token: pageAccessToken },
          }
        )
        .catch((error) => console.error(error));
      reset();
    };

  return (
    <div>
      <div>{pageInfo.name}</div>
      <div>Last message received: {lastMessage?.text}</div>
      {lastMessage?.senderId && (
        <form
          onSubmit={handleSubmit(
            onSubmit(pageInfo.accessToken, lastMessage.senderId)
          )}
        >
          <input {...register("message")} />
          <input type="submit" />
        </form>
      )}
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
