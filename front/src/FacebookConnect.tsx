import React, {
  useState,
  useContext,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import NewWindow from "react-new-window";
import { AccessTokenInfo } from "./App";
import { SocketContext } from "./context/socket";

interface FacebookConnectProps {
  setAccessTokenInfo: Dispatch<SetStateAction<AccessTokenInfo | null>>;
}

const FacebookConnect = ({ setAccessTokenInfo }: FacebookConnectProps) => {
  const SCOPES_TO_ASK =
    "business_management,pages_show_list,email,pages_read_user_content,pages_manage_engagement,pages_read_engagement,pages_manage_metadata,pages_messaging";
  const [hidden, setHidden] = useState<boolean>(true);
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
  }, [socket, setAccessTokenInfo]);

  return (
    <div>
      {!hidden && (
        <NewWindow
          url={`https://www.facebook.com/v12.0/dialog/oauth?client_id=${process.env.REACT_APP_FACEBOOK_CLIENT_ID}&display=popup&redirect_uri=${process.env.REACT_APP_FACEBOOK_REDIRECT_URI}&state={socketId=${socket.id}}&response_type=code,granted_scopes&scope=${SCOPES_TO_ASK}`}
          onUnload={hideWindow}
        />
      )}
      <button onClick={showWindow}>Connect to Facebook</button>
    </div>
  );
};

export default FacebookConnect;
