// ModalComponent.tsx
import React, { useState } from "react";
import Modal from "react-modal";

interface ModalComponentProps {
  isOpen: boolean;
  onRequestClose: () => void;
  contentLabel: string;
  onSubmit: (username: string) => void;
}

const UsernameModal: React.FC<ModalComponentProps> = ({
  isOpen,
  onRequestClose,
  contentLabel,
  onSubmit,
}) => {
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = () => {
    if (username.length >= 4) {
      onSubmit(username);
      onRequestClose();
      setErrorMessage("");
    } else {
      setErrorMessage("Invalid Username, should be atleast 4 characters! ");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      contentLabel={contentLabel}
      ariaHideApp={false}
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          width: "400px",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          backgroundColor: "#f9f9f9",
        },
      }}
    >
      <h2 style={{ textAlign: "center", color: "#333" }}>
        Enter your username to continue to chat
      </h2>

      <p style={{ color: "red", marginTop: 10 }}>{errorMessage}</p>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
        style={{
          padding: "10px",
          width: "100%",
          margin: "20px 0",
          border: "1px solid #ddd",
          borderRadius: "8px",
          outline: "none",
        }}
      />
      <button
        onClick={handleSubmit}
        style={{
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
          backgroundColor: "#007bff",
          color: "white",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Submit
      </button>
    </Modal>
  );
};

export default UsernameModal;
