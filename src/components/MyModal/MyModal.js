import Modal from "react-modal";
import "./MyModal.css";
import Input from "../Input/Input";

Modal.setAppElement("#root");

const MyModal = ({
  modalState,
  isOpen,
  toggleModal,
  textAreaChangeHandler,
  add,
  cancel,
  edit,
  del,
  contentForEdit,
  titleChangeHandler,
  create,
}) => {
  return (
    <Modal
      ariaHideApp={false}
      isOpen={isOpen}
      onRequestClose={toggleModal}
      contentLabel="My dialog"
      className="mymodal"
      overlayClassName="myoverlay"
      closeTimeoutMS={500}
    >
      {modalState == "createStory" && (
        <div>
          <Input onChange={titleChangeHandler} type="text">
            Story Title
          </Input>
          <div className="first-sentence">First sentence:</div>
        </div>
      )}
      {(modalState == "add" || modalState == "edit" || modalState == "createStory") && (
        <textarea
          value={contentForEdit}
          onChange={textAreaChangeHandler}
          rows="5"
          cols="70"
          className="new-sentence-input"
        ></textarea>
      )}
      {modalState == "add" && (
        <button className="add-button" onClick={add}>
          Add
        </button>
      )}
      {modalState == "edit" && (
        <button className="edit-button" onClick={edit}>
          Edit
        </button>
      )}
      {modalState == "delete" && (
        <button className="delete-button" onClick={del}>
          Delete
        </button>
      )}
      {modalState == "createStory" && (
        <button className="create-story-button" onClick={create}>
          Create Story
        </button>
      )}
      <button className="cancel-button" onClick={cancel}>
        Cancel
      </button>
    </Modal>
  );
};

export default MyModal;
