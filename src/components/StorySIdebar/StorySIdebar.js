import "./StorySidebar.css";
import { useContext } from "react";
import { UserContext } from "../../contexts/user-context";

const StorySidebar = ({ storySelected, setStorySelected, toggleModal, setModalState, storyTitles }) => {
  const userCtx = useContext(UserContext);

  const clickHandler = (e) => {
    setStorySelected(e.target.innerText);
  };

  const createNewStoryClickHandler = () => {
    if (userCtx.currentUser?.emailVerified) {
      toggleModal();
      setModalState("createStory");
      return;
    }
    alert("please verify your email");
  };

  return (
    <div className="sidebar">
      <div className="stories-title">Stories</div>
      {userCtx.currentUser && (
        <div onClick={createNewStoryClickHandler} className="add-new-story">
          Add New Story
        </div>
      )}

      {storyTitles.map((title) => {
        const classes = title === storySelected ? "sidebar-title selected" : "sidebar-title";
        return (
          <div className={classes} onClick={clickHandler} key={title}>
            {title}
          </div>
        );
      })}
    </div>
  );
};

export default StorySidebar;
