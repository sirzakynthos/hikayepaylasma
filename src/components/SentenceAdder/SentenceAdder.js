import "./SentenceAdder.css";
import { Fragment, useContext } from "react";
import { UserContext } from "../../contexts/user-context";

const SentenceAdder = ({ index, onClick }) => {
  const userCtx = useContext(UserContext);
  const clickHandler = () => {
    onClick(index);
  };
  return (
    <Fragment>
      {userCtx.currentUser?.emailVerified && (
        <div onClick={clickHandler} className="new-sentence-btn">
          +
        </div>
      )}
    </Fragment>
  );
};

export default SentenceAdder;
