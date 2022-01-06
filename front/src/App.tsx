import React from "react";
import FacebookConnect from "./FacebookConnect";
import { socket, SocketContext } from "./context/socket";

const App = () => {
  return (
    <div>
      <SocketContext.Provider value={socket}>
        <FacebookConnect />
      </SocketContext.Provider>
    </div>
  );
};

export default App;
