import "./Websocket.css";
import UsernameModal from "./UsernameModal/UsernameModal";
import DefaultUserSvg from "./Svg/DefaultUserSvg";
import CreateGroupModal from "./CreateGroupModal/CreateGroupModal";
import { useChatHook } from "../hooks/useChatHook";
import ChatWindow from "./Chat/ChatWindow";

const Websocket = () => {
  const {
    users,
    username,
    unreadCounts,
    groups,
    senderId,
    receiverId,
    receiverUsername,
    dropdownOpen,
    receiverMessages,
    messagesEndRef,
    showEmojiPicker,
    value,
    groupChatActive,
    fixedGroupMessages,
    modalIsOpen,
    groupModalIsOpen,
    selectReceiver,
    selectChatgroup,
    toggleDropdown,
    openGroupModal,
    setShowEmojiPicker,
    setValue,
    sendPrivateMessage,
    sendGroupMessage,
    handleKeyPress,
    closeModal,
    handleUsernameSubmit,
    closeGroupModal,
    handleGroupSubmit,
  } = useChatHook();

  return (
    <div className="websocket-container">
      <div className="chat-list">
        <h2>Chats</h2>
        <ul>
          {users.map(
            (user, index) =>
              user.username !== username && (
                <li
                  className="user-row"
                  key={index}
                  onClick={() => selectReceiver(user.userID, user.username)}
                >
                  <DefaultUserSvg />
                  <span>{user.username}</span>
                  {unreadCounts[user.userID] > 0 && (
                    <p className="unread-count">
                      {unreadCounts[user.userID] || 0}
                    </p>
                  )}
                </li>
              )
          )}
        </ul>

        {groups.length > 0 && (
          <div>
            <h2>Groups</h2>
            <ul>
              {groups.map((group, index) => (
                <li
                  className="user-row"
                  key={index}
                  onClick={() => selectChatgroup(group)}
                >
                  <DefaultUserSvg />
                  <span>{group.groupname}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="chat-window">
        <div className="chat-header">
          <div className="chat-info">
            <h1 className="title">
              Chat Messages{" "}
              {receiverId && receiverUsername && `(${receiverUsername})`}
            </h1>
            {username && <p className="subtitle">Logged in as: {username}</p>}
          </div>
          <div className="user-actions">
            <div className="user-image">
              <DefaultUserSvg />
            </div>
            <span className="username">{username}</span>
            <button onClick={toggleDropdown} className="dropdown-toggle">
              &#9662;
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <ul>
                  <li onClick={openGroupModal}>Create Group</li>
                  <li>Check Profile</li>
                  <li>Settings</li>
                  <li>Logout</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {receiverUsername ? (
          <ChatWindow
            messages={receiverMessages}
            privateChat={true}
            senderId={senderId}
            messagesEndRef={messagesEndRef}
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
            newMessage={value}
            setNewMessage={setValue}
            sendMessage={sendPrivateMessage}
            handleKeyPress={handleKeyPress}
          />
        ) : groupChatActive ? (
          <ChatWindow
            messages={fixedGroupMessages}
            privateChat={false}
            senderId={senderId}
            messagesEndRef={messagesEndRef}
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
            newMessage={value}
            setNewMessage={setValue}
            sendMessage={sendGroupMessage}
            handleKeyPress={handleKeyPress}
          />
        ) : (
          <div className="no-chat-selected-window">
            <h1>Your conversations will show here</h1>
          </div>
        )}
      </div>
      <UsernameModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Enter Username Modal"
        onSubmit={handleUsernameSubmit}
      />

      <CreateGroupModal
        isOpen={groupModalIsOpen}
        users={users}
        onRequestClose={closeGroupModal}
        contentLabel="Create Group Modal"
        onSubmit={handleGroupSubmit}
      />
    </div>
  );
};

export default Websocket;
