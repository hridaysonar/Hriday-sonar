import { Outlet } from "react-router-dom";
import "./App.css";
import Nav from "./Nav";
import Snowfall from "react-snowfall";

function App() {
  return (
    <div className="relative min-h-screen overflow-clip custom-text ">
      {/* Snowfall Effect */}
      <Snowfall
        color="white"
        snowflakeCount={35} 
        wind={[-1, 1]}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",  
          zIndex: 9999, 
        }}
      />

      {/* Main Content */}
      <Nav />
      <Outlet />
    </div>
  );
}

export default App;
