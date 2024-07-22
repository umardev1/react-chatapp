// ModalComponent.tsx
import React, { useEffect, useState } from "react";
import Modal from "react-modal";

interface ModalComponentProps {
  isOpen: boolean;
  onRequestClose: () => void;
  contentLabel: string;
  onSubmit: (selected: any[], groupname: string) => void;
  users: any[];
}

const CreateGroupModal: React.FC<ModalComponentProps> = ({
  isOpen,
  onRequestClose,
  contentLabel,
  onSubmit,
  users,
}) => {
  const [connectedUsers, setConnectedUsers] = useState(users);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [groupname, setGroupname] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setConnectedUsers(users);
  }, [users]);

  const handleSubmit = () => {
    console.log("selectedUsers", selectedUsers);
    if (groupname.length < 4) {
      setErrorMessage("Invalid Group name, should be atleast 4 characters! ");
      return;
    } else {
      setErrorMessage("");
    }

    if (selectedUsers.length > 1) {
      onSubmit(selectedUsers, groupname);
      onRequestClose();
      setErrorMessage("");
    } else {
      setErrorMessage(
        "Atleast 2 users need to be selected for creating a group!"
      );
    }
  };

  const selectUsers = (userID: string) => {
    const filteredUsers = connectedUsers.map((user) => {
      if (user.userID === userID) {
        user.selected = user.selected ? !user.selected : true;
      }
      return user;
    });
    setConnectedUsers(filteredUsers);

    const selected = filteredUsers.filter(
      (filteredUser) => filteredUser.selected || filteredUser.self
    );
    if (selected) {
      setSelectedUsers(selected);
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
        Choose people you want to chat with! Must be more than 1
      </h2>

      <p style={{ color: "red", marginTop: 10 }}>{errorMessage}</p>

      <input
        type="text"
        value={groupname}
        onChange={(e) => setGroupname(e.target.value)}
        placeholder="Enter your group name"
        style={{
          padding: "10px",
          width: "100%",
          margin: "20px 0 20px 0",
          border: "1px solid #ddd",
          borderRadius: "8px",
          outline: "none",
        }}
      />

      {connectedUsers.map((user, index) => {
        if (!user.self) {
          return (
            <div
              key={index}
              onClick={() => {
                selectUsers(user.userID);
              }}
              style={
                user.selected
                  ? {
                      border: "1px solid #ddd",
                      borderRadius: 8,
                      padding: 10,
                      color: "white",
                      backgroundColor: "#64de84",
                      marginTop: 20,
                      marginBottom: 20,
                      cursor: 'pointer',
                    }
                  : {
                      border: "1px solid #ddd",
                      borderRadius: 8,
                      padding: 10,
                      backgroundColor: "#fff",
                      marginTop: 20,
                      marginBottom: 20,
                      cursor: 'pointer',
                    }
              }
            >
              <p>{user.username}</p>
            </div>
          );
        } else {
          return false;
        }
      })}
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

export default CreateGroupModal;
