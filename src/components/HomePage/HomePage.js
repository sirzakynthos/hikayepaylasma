import StorySidebar from "../StorySIdebar/StorySIdebar";
import Story from "../Story/Story";
import "./HomePage.css";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../contexts/user-context";
import MyModal from "../MyModal/MyModal";
import { addSentenceToStory, editSentence, deleteSentence, addStory, getStoryTitles } from "../../utils/firebase";

const HomePage = () => {
  const [sentences, setSentences] = useState([]);
  const [storySelected, setStorySelected] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [slot, setSlot] = useState(0);
  const [sentenceToAdd, setSentenceToAdd] = useState("");
  const [modalState, setModalState] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [storyTitles, setStoryTitles] = useState([]);

  const userCtx = useContext(UserContext);

  const getTitles = async () => {
    let response = await getStoryTitles();
    setStoryTitles(response);
    if (response.length === 0) {
      setStorySelected("");
    } else {
      setStorySelected(sessionStorage.getItem("story") || response[0]);
    }
  };

  useEffect(() => {
    getTitles();
  }, []);

  useEffect(() => {
    if (storySelected !== "") sessionStorage.setItem("story", storySelected);
  }, [storySelected]);

  const toggleModal = () => {
    setIsOpen(!isOpen);
    setSentenceToAdd("");
  };

  const addSubmitHandler = async (e) => {
    try {
      const randomID = Date.now().toString(36) + Math.random().toString(36).substr(2);

      let res = await addSentenceToStory(
        randomID,
        sentenceToAdd,
        slot,
        storySelected,
        userCtx.currentUser.displayName,
        userCtx.currentUser.uid
      );

      let copy = [...sentences];
      copy.splice(slot, 0, {
        id: randomID,
        index: slot,
        content: sentenceToAdd,
        authorID: userCtx.currentUser.uid,
        authorName: userCtx.currentUser.displayName,
        upvotes: [],
        downvotes: [],
      });
      setSentences(copy);
      toggleModal();
    } catch (error) {
      console.log(error);
    }
  };

  const editSubmitHandler = async (e) => {
    try {
      console.log(slot);
      let res = await editSentence(storySelected, sentences[slot].id, sentenceToAdd);
      let copy = [...sentences];
      copy[slot].content = sentenceToAdd;
      setSentences(copy);
      toggleModal();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteSubmitHandler = async () => {
    try {
      const res = await deleteSentence(storySelected, sentences[slot].id, slot);
      let copy = [...sentences];
      copy.splice(slot, 1);
      setSentences(copy);
      toggleModal();
    } catch (error) {
      console.log(error);
    }
  };

  const createStorySubmitHandler = async () => {
    const randomID = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const sentence = {
      id: randomID,
      index: 0,
      content: sentenceToAdd,
      authorID: userCtx.currentUser.uid,
      authorName: userCtx.currentUser.displayName,
      upvotes: [],
      downvotes: [],
    };
    try {
      const res = await addStory(sentence, newTitle);
      let copy = [...storyTitles];
      copy.push(newTitle);
      setStoryTitles(copy);
      setStorySelected(newTitle);
      setSentences([sentence]);
      toggleModal();
    } catch (error) {
      console.log(error);
    }
  };

  const textAreaChangeHandler = (e) => {
    setSentenceToAdd(e.target.value);
  };

  const titleChangeHandler = (e) => {
    setNewTitle(e.target.value);
  };

  return (
    <div className="homepage">
      <MyModal
        isOpen={isOpen}
        toggleModal={toggleModal}
        textAreaChangeHandler={textAreaChangeHandler}
        titleChangeHandler={titleChangeHandler}
        add={addSubmitHandler}
        cancel={toggleModal}
        edit={editSubmitHandler}
        del={deleteSubmitHandler}
        create={createStorySubmitHandler}
        modalState={modalState}
        contentForEdit={sentenceToAdd}
      ></MyModal>
      <StorySidebar
        storySelected={storySelected}
        toggleModal={toggleModal}
        setModalState={setModalState}
        setStorySelected={setStorySelected}
        storyTitles={storyTitles}
        setStoryTitles={setStoryTitles}
      ></StorySidebar>
      <Story
        storySelected={storySelected}
        toggleModal={toggleModal}
        setSlot={setSlot}
        setModalState={setModalState}
        setSentenceToAdd={setSentenceToAdd}
        sentences={sentences}
        setSentences={setSentences}
      ></Story>
    </div>
  );
};

export default HomePage;
