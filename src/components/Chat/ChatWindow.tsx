import React from "react";
import {
  GroupMessagePayload,
  MessagePayload,
} from "../../shared/interfaces/Chat";
import EmojiPicker from "emoji-picker-react";
import PaperPlaneIconSvg from "../Svg/PaperPlaneIconSvg";

type ChatWindowProps = {
  messages: MessagePayload[] | GroupMessagePayload[];
  privateChat: boolean;
  senderId: string | null;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (value: React.SetStateAction<boolean>) => void;
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  sendMessage: () => void;
};
const ChatWindow = ({
  messages,
  privateChat,
  senderId,
  messagesEndRef,
  showEmojiPicker,
  setShowEmojiPicker,
  newMessage,
  setNewMessage,
  sendMessage,
  handleKeyPress,
}: ChatWindowProps) => {
  return (
    <>
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">{`No ${
            privateChat ? "private" : "group"
          } messages`}</div>
        ) : (
          <div className="messages-list">
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.from === senderId
                    ? "message-receiver"
                    : "message-sender"
                }
              >
                <div
                  className={
                    message.from === senderId
                      ? "message green-background"
                      : "message blue-background"
                  }
                >
                  <div>
                    {(message as GroupMessagePayload).username !==
                      undefined && (
                      <h4>{(message as GroupMessagePayload).username}</h4>
                    )}
                    <p style={{ marginTop: 5 }}>{message.content}</p>
                  </div>
                  <span>
                    {message.date} {message.time}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <div className="input-container">
        <div
          className="emoji-picker-button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          😊
        </div>
        {showEmojiPicker && (
          <div className="emoji-picker">
            <EmojiPicker
              open={showEmojiPicker}
              onEmojiClick={(emojiObject) => {
                setNewMessage((prev) => prev + emojiObject.emoji);
              }}
            />
          </div>
        )}
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="input-field"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className={
            "submit-button " + (newMessage === "" ? "button-disabled" : "")
          }
          disabled={newMessage === ""}
        >
          <PaperPlaneIconSvg />
        </button>
      </div>
    </>
  );
};

export default ChatWindow;
