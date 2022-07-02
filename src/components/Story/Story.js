import "./Story.css";
import Sentence from "../Sentence/Sentence";
import { Fragment, useContext, useEffect } from "react";
import { UserContext } from "../../contexts/user-context";
import { getStoryFromFirestore } from "../../utils/firebase";
import SentenceAdder from "../SentenceAdder/SentenceAdder";

const Story = ({ storySelected, toggleModal, setSlot, setModalState, setSentenceToAdd, sentences, setSentences }) => {
  const userCtx = useContext(UserContext);

  const sentenceAdderClickHandler = (index) => {
    toggleModal();
    setSlot(index);
    setModalState("add");
  };

  const sentenceEditerClickHandler = (index, content) => {
    toggleModal();
    setSlot(index);
    setModalState("edit");
    setSentenceToAdd(content);
  };
  const sentenceDeleterClickHandler = (index) => {
    toggleModal();
    setSlot(index);
    setModalState("delete");
  };

  useEffect(() => {
    const load = async () => {
      if (storySelected === "") return;
      const result = await getStoryFromFirestore(storySelected);
      result.sort((a, b) => a.index - b.index);
      setSentences(result);
    };
    load();
  }, [storySelected, setSentences]);

  return (
    <Fragment>
      <ol className="story-container">
        {userCtx.currentUser && !userCtx.currentUser.emailVerified ? (
          <h2 className="confirm-message">Please confirm your e-mail address.</h2>
        ) : null}
        <h2>{storySelected}</h2>

        {storySelected && <SentenceAdder index={0} onClick={sentenceAdderClickHandler} />}
        {sentences.map((sentence, i) => {
          return (
            <li key={sentence.id}>
              <Sentence
                storyTitle={storySelected}
                index={i}
                edit={sentenceEditerClickHandler}
                del={sentenceDeleterClickHandler}
                info={sentence}
              >
                {sentence.content}
              </Sentence>
              <SentenceAdder index={i + 1} onClick={sentenceAdderClickHandler} />
            </li>
          );
        })}
      </ol>
    </Fragment>
  );
};

export default Story;
