import { ReactComponent as ThumbsDown } from "../../assets/hand-thumbs-down.svg";
import { ReactComponent as ThumbsUp } from "../../assets/hand-thumbs-up.svg";
import { ReactComponent as ThumbsDownFill } from "../../assets/hand-thumbs-down-fill.svg";
import { ReactComponent as ThumbsUpFill } from "../../assets/hand-thumbs-up-fill.svg";
import { useContext } from "react";
import { UserContext } from "../../contexts/user-context";
import "./ThumbsUpAndDown.css";
import { useNavigate } from "react-router-dom";

const ThumbsUpAndDown = ({ state, thumbsDownClickHandler, thumbsUpClickHandler }) => {
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  const pleaseLogin = () => {
    if (userCtx.currentUser) alert("please verify your email");
    else navigate("/sign-in");
  };

  return (
    <div className="svg-container">
      {state !== "up" ? (
        <ThumbsUp onClick={userCtx.currentUser?.emailVerified ? thumbsUpClickHandler : pleaseLogin} className="logo" />
      ) : null}
      {state === "up" ? <ThumbsUpFill onClick={thumbsUpClickHandler} className="logo" /> : null}
      {state !== "down" ? (
        <ThumbsDown
          onClick={userCtx.currentUser?.emailVerified ? thumbsDownClickHandler : pleaseLogin}
          className="logo"
        />
      ) : null}
      {state === "down" ? <ThumbsDownFill onClick={thumbsDownClickHandler} className="logo" /> : null}
    </div>
  );
};

export default ThumbsUpAndDown;
