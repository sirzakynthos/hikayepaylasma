import { Routes, Route } from "react-router-dom";
import SignIn from "./components/Sign-In/Sign-In";
import SignUp from "./components/Sign-Up/Sign-Up";
import Navigation from "./components/Navigation/Navigation";
import "./App.css";
import HomePage from "./components/HomePage/HomePage";
import { Fragment, useEffect } from "react";
import stories from "./stories";
import { uploadStories } from "./utils/firebase";

const App = () => {
  console.log("app run");
  // useEffect(() => {
  //   uploadStories(stories);
  // }, []);

  return (
    <Fragment>
      <Navigation></Navigation>
      <Routes>
        <Route path="/" element={<HomePage></HomePage>} exact />
        <Route path="/sign-in" element={<SignIn></SignIn>} exact />
        <Route path="/sign-up" element={<SignUp></SignUp>} exact />
      </Routes>
    </Fragment>
  );
};

export default App;
