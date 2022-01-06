import React from "react";
import "./App.css";
import FacebookConnect from "./FacebookConnect";
import { socket, SocketContext } from "./context/socket";

const App = () => {
  return (
    <div className="App">
      <SocketContext.Provider value={socket}>
        <FacebookConnect />
      </SocketContext.Provider>
    </div>
  );
};

export default App;
