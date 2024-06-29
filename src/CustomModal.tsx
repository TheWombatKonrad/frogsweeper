import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import "./CustomModal.css";

export default function CustomModal(props: {
  title: string;
  content: React.ReactNode;
}) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [customStyles, setCustomStyles] = useState({});
  let startingWindowSize: any = [];

  if (typeof window !== "undefined") {
    startingWindowSize = [window.innerWidth, window.innerHeight];
  }

  const [windowSize, setWindowSize] = useState(startingWindowSize);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    if (windowSize[0] >= "800") {
      setCustomStyles(customStylesBig);
    } else {
      setCustomStyles(customStylesSmall);
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [windowSize]);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div className="outer-modal">
      <button onClick={openModal}>{props.title}</button>

      <Modal
        appElement={document.getElementById("root")!}
        contentLabel="Game Difficulty"
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            zIndex: 2,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
          },
          content: customStyles,
        }}
      >
        <div id="modal">
          <div id="modal-top-bar">
            <h2>{props.title}</h2>
            <button onClick={closeModal} id="close-modal-button">
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
          <div id="modal-content">{props.content}</div>
        </div>
      </Modal>
    </div>
  );
}

const customStylesBig = {
  margin: "auto",
  width: "fit-content",
  height: "fit-content",
  padding: "0px",
  overflow: "hidden",
  fontSize: "12px",
  background: "rgb(109, 169, 109)",
  border: "2px solid rgb(41, 62, 41)",
};

const customStylesSmall = {
  margin: "auto",
  width: "fit-content",
  height: "fit-content",
  padding: "5px",
  overflow: "hidden",
  fontSize: "12px",
  background: "rgb(109, 169, 109)",
  border: "2px solid rgb(61, 94, 61)",
};
