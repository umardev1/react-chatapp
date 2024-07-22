import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { GroupMessagePayload, MessagePayload } from "../shared/interfaces/Chat";
import { WebsocketContext } from "../context/WebsocketContext";
import { formatDate, formatTime } from "../shared/methods/general";

export const useChatHook = () => {
  const [groupChatActive, setGroupChatActive] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [groupModalIsOpen, setGroupModalIsOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [value, setValue] = useState("");
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const [receiverUsername, setReceiverUsername] = useState<string | null>(null);
  const [senderId, setSenderId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const [receiverMessages, setReceiverMessages] = useState<MessagePayload[]>(
    []
  );
  const [groupMessages, setGroupMessages] = useState<GroupMessagePayload[]>([]);
  const [fixedGroupMessages, setFixedGroupMessages] = useState<
    GroupMessagePayload[]
  >([]);
  const [users, setUsers] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<any>({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<any>({});

  const socket = useContext(WebsocketContext);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const receiverIdRef = useRef<string | null>(null);

  const toggleDropdown = useCallback(() => {
    setDropdownOpen((prev) => !prev);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const openModal = useCallback(() => {
    setModalIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalIsOpen(false);
  }, []);

  const openGroupModal = useCallback(() => {
    setDropdownOpen(false);
    const filterUsers = users.filter((user) => !user.self);
    if (filterUsers.length > 0) {
      setGroupModalIsOpen(true);
    } else {
      alert("No users connected");
    }
  }, [users]);

  const closeGroupModal = useCallback(() => {
    setGroupModalIsOpen(false);
  }, []);

  const handleUsernameSubmit = useCallback(
    (username: string) => {
      setUsername(username);
      socket.emit("register", username);
    },
    [socket]
  );

  const handleGroupSubmit = useCallback(
    (selected: any[], groupName: string) => {
      socket.emit("createGroup", { groupName, members: selected });
    },
    [socket]
  );

  const sendPrivateMessage = useCallback(() => {
    setShowEmojiPicker(false);
    const now = new Date();
    const formattedDate = formatDate(now);
    const formattedTime = formatTime(now);

    const newMessage = {
      content: value,
      msg: "New Message",
      to: receiverId,
      from: senderId,
      date: formattedDate,
      time: formattedTime,
    };

    setMessages((prev) => [...prev, newMessage]);
    socket.emit("newMessage", newMessage);
    setValue("");
  }, [value, receiverId, senderId, socket]);

  const sendGroupMessage = useCallback(() => {
    setShowEmojiPicker(false);
    const now = new Date();
    const formattedDate = formatDate(now);
    const formattedTime = formatTime(now);

    const payload = {
      groupName: selectedGroup.groupname,
      from: senderId,
      message: value,
      date: formattedDate,
      time: formattedTime,
    };

    socket.emit("groupMessage", payload);
    setValue("");
  }, [value, selectedGroup.groupname, senderId, socket]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        if (groupChatActive) {
          sendGroupMessage();
        } else {
          sendPrivateMessage();
        }
      }
    },
    [sendPrivateMessage, sendGroupMessage]
  );

  const selectReceiver = useCallback(
    (userId: string, userName: string) => {
      setGroupChatActive(false);
      const rMessages = messages.filter(
        (message) => message.to === userId || message.from === userId
      );
      setReceiverMessages(rMessages);
      setReceiverId(userId);
      receiverIdRef.current = userId;
      setReceiverUsername(userName);
      socket.emit("resetCount", userId);
    },
    [messages]
  );

  const selectChatgroup = useCallback(
    (group: { groupname: string; users: any[] }) => {
      setReceiverUsername(null);
      setGroupChatActive(true);
      setSelectedGroup(group);

      setFixedGroupMessages(
        groupMessages.filter((message) => message.groupName === group.groupname)
      );
    },
    [groupMessages]
  );

  const handleGroupMessageChange = useCallback(
    (groupName: string, messages: any[]) => {
      setFixedGroupMessages(
        messages.filter((message) => message.groupName === groupName)
      );
    },
    []
  );

  const checkAndResetUnread = (userId: string) => {
    const currentReceiverId = receiverIdRef.current;
    if (userId === currentReceiverId) {
      console.log("will reset");
      socket.emit("resetCount", userId);
    }
  };

  useEffect(() => {
    openModal();

    socket.on("connect", () => {
      console.log("Connected");
    });

    const handleNewMessage = (newMessage: MessagePayload) => {
      setMessages((prev) => [...prev, newMessage]);
    };

    const handleGroupCreated = (data: any) => {
      setGroups((prev) => [
        ...prev,
        {
          groupname: data.groupName,
          users: data.members,
        },
      ]);
    };

    const handleGroupMessage = (data: any) => {
      setGroupMessages((prev) => {
        handleGroupMessageChange(data.groupName, [...prev, data]);
        return [...prev, data];
      });
    };

    const handleUpdateUnreadCount = ({ user, count }: any) => {
      checkAndResetUnread(user);
      setUnreadCounts((prevCounts: any) => ({
        ...prevCounts,
        [user]: count,
      }));
    };

    const handleResetSuccess = ({ user, count }: any) => {
      setUnreadCounts((prevCounts: any) => ({
        ...prevCounts,
        [user]: count,
      }));
    };

    socket.on("onMessage", handleNewMessage);
    socket.on("groupCreated", handleGroupCreated);
    socket.on("onGroupMessage", handleGroupMessage);
    socket.on("updateUnreadCount", handleUpdateUnreadCount);
    socket.on("resetSuccess", handleResetSuccess);

    return () => {
      socket.off("connect");
      socket.off("onMessage", handleNewMessage);
      socket.off("groupCreated", handleGroupCreated);
      socket.off("onGroupMessage", handleGroupMessage);
      socket.off("updateUnreadCount", handleUpdateUnreadCount);
      socket.off("resetSuccess", handleResetSuccess);
    };
  }, [openModal, socket, handleGroupMessageChange]);

  useEffect(() => {
    scrollToBottom();
    if (receiverId) {
      setReceiverMessages(
        messages.filter(
          (message) => message.to === receiverId || message.from === receiverId
        )
      );
    }
    /*users.forEach((user) => {
      user.messages = messages.filter(
        (message) => message.to === user.userID || message.from === user.userID
      );
    });*/
  }, [messages, receiverId, users]);

  useEffect(() => {
    if (username) {
      const handleUsers = (users: any) => {
        users.forEach((user: any) => {
          user.selected = false;
          user.self = user.username === username;
          if (user.self) {
            setSenderId(user.userID);
          }
        });
        setUsers(users);
      };

      socket.on("users", handleUsers);

      return () => {
        socket.off("users", handleUsers);
      };
    }
  }, [username, socket]);

  return {
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
  };
};
