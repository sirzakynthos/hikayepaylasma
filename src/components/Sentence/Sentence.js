import { useEffect, useState } from "react";
import "./Sentence.css";
import ThumbsUpAndDown from "../ThumbsUpAndDown/ThumbsUpAndDown";
import { upvoteSentence, downvoteSentence, removeVote } from "../../utils/firebase";
import { UserContext } from "../../contexts/user-context";
import { useContext } from "react";

const Sentence = ({ edit, del, info, children, index, storyTitle }) => {
  const [hovering, setHovering] = useState(false);
  const [thumbsState, setThumbsState] = useState("neutral");
  const [likeCount, setLikeCount] = useState(0);

  const userCtx = useContext(UserContext);

  useEffect(() => {
    if (info.upvotes.includes(userCtx.currentUser?.uid)) {
      setThumbsState("up");
    }
    if (info.downvotes.includes(userCtx.currentUser?.uid)) {
      setThumbsState("down");
    }
    setLikeCount(info.upvotes.length - info.downvotes.length);
  }, []);

  const hoverHandler = (e) => {
    setHovering(true);
  };
  const leaveHandler = (e) => {
    setHovering(false);
  };
  const thumbsUpClickHandler = async () => {
    if (thumbsState === "up") {
      try {
        const res = await removeVote(info.id, storyTitle, userCtx.currentUser.uid, "upvotes");
        setThumbsState("neutral");
        setLikeCount((prev) => prev - 1);
      } catch (error) {
        console.log("ERROR");
      }
    }
    if (thumbsState === "down") {
      try {
        const res = await upvoteSentence(info.id, storyTitle, userCtx.currentUser.uid, true);
        setThumbsState("up");
        setLikeCount((prev) => prev + 2);
      } catch (error) {
        console.log("ERROR");
      }
    }
    if (thumbsState === "neutral") {
      try {
        const res = await upvoteSentence(info.id, storyTitle, userCtx.currentUser.uid, false);
        setLikeCount((prev) => prev + 1);
        setThumbsState("up");
      } catch (error) {
        console.log("ERROR");
      }
    }
  };
  const thumbsDownClickHandler = async () => {
    if (thumbsState === "down") {
      try {
        const res = await removeVote(info.id, storyTitle, userCtx.currentUser.uid, "downvotes");
        setLikeCount((prev) => prev + 1);
        setThumbsState("neutral");
      } catch (error) {
        console.log("ERROR");
      }
    }
    if (thumbsState === "up") {
      try {
        const res = await downvoteSentence(info.id, storyTitle, userCtx.currentUser.uid, true);
        setLikeCount((prev) => prev - 2);
        setThumbsState("down");
      } catch (error) {
        console.log("ERROR");
      }
    }
    if (thumbsState === "neutral") {
      try {
        const res = await downvoteSentence(info.id, storyTitle, userCtx.currentUser.uid, false);
        setLikeCount((prev) => prev - 1);
        setThumbsState("down");
      } catch (error) {
        console.log("ERROR");
      }
    }
  };

  return (
    <div onMouseEnter={hoverHandler} onMouseLeave={leaveHandler} className="sentence">
      {userCtx.currentUser && hovering && <span className="author-info">({info.authorName})</span>}
      <ThumbsUpAndDown
        state={thumbsState}
        thumbsUpClickHandler={thumbsUpClickHandler}
        thumbsDownClickHandler={thumbsDownClickHandler}
      />
      <span className="like-count">{likeCount}</span>
      {children}
      {userCtx.currentUser?.uid === info.authorID && hovering && (
        <button onClick={() => edit(index, children)} className="edit-btn">
          Edit
        </button>
      )}
      {userCtx.currentUser?.uid === info.authorID && hovering && (
        <button onClick={() => del(index)} className="delete-btn">
          Delete
        </button>
      )}
    </div>
  );
};

export default Sentence;
