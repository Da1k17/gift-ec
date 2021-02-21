import React from "react";
import {Header} from "./components/Header/index";
import Router from "./Router";
import "./assets/reset.css";
import "./assets/style.css";

const App = () => {
  return (
    <>
    <Header />
    <main className="c-main">
      <Router />
    </main>
    </>
  )
};

export default App
