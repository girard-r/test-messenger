import React, { useState, useContext, useEffect } from "react";
import NewWindow from "react-new-window";
import { SocketContext } from "./context/socket";

const FacebookConnect = () => {
  const SCOPES_TO_ASK =
    "business_management,pages_show_list,email,pages_read_user_content,pages_manage_engagement,pages_read_engagement,pages_manage_metadata,pages_messaging";
  const [hidden, setHidden] = useState<boolean>(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const socket = useContext(SocketContext);

  const showWindow = () => {
    setHidden(false);
  };

  const hideWindow = () => {
    setHidden(true);
  };

  useEffect(() => {
    socket.on("accessToken", (res: { accessToken: string }) => {
      setAccessToken(res.accessToken);
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
      {accessToken && <p>User Access Token: {accessToken}</p>}
    </div>
  );
};

export default FacebookConnect;
