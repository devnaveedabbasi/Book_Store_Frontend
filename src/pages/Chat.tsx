import React, { useEffect, useRef, useState } from "react";
import {
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  X,
  Menu,
  Edit,
  Trash2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { GetUserDetails } from "../features/slicer/AuthSlice";
import { baseUrlImg, socket } from "../features/slicer/Slicer";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { ImageUpload } from "../features/slicer/MessageSlice";
import { useLocation } from "react-router-dom";

interface SidebarUser {
  userId: string;
  fullName: string;
  email: string;
  lastMessage: string;
  lastSeen: string;
  lastTime: string;
  online: boolean;
}

interface Message {
  _id: string;
  sender: string;
  receiver: string;
  text?: string;
  image?: string[];
  edited?: boolean;
  editedAt?: string;
  createdAt: string;
}

const ChatInterface = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SidebarUser | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sendingImages, setSendingImages] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [sidebarUsers, setSidebarUsers] = useState<SidebarUser[]>([]);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalStartIndex, setModalStartIndex] = useState(0);
  const [editMessageId, setEditMessageId] = useState<string | null>(null);
  const [editMessageText, setEditMessageText] = useState<string>("");
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const location = useLocation();
  const book = location.state?.book;
  const [currentUserId, setCurrentUserId] = useState<string>("");

  console.log(book);

  useEffect(() => {
    if (
      book &&
      book.uploader &&
      book.uploader._id &&
      currentUserId &&
      book.uploader._id !== currentUserId
    ) {
      setSelectedUser({
        userId: book.uploader._id,
        fullName: book.uploader.fullName,
        email: book.uploader.email,
        lastMessage: "",
        lastSeen: "",
        lastTime: "",
        online: false,
      });
    }
  }, [book, currentUserId]);

  console.log(currentUserId, "ss");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetUserDetails() as any);
  }, []);

  const { UserData } = useSelector((state: any) => state.AuthSlice);

  useEffect(() => {
    if (UserData && UserData.data && UserData.data._id) {
      setCurrentUserId(UserData.data._id);
    }
  }, [UserData]);

  useEffect(() => {
    if (!currentUserId) return;

    // Add current user to online users
    socket.emit("addUser", currentUserId);

    // Get chat users
    socket.emit("getChatUsers", currentUserId);

    // Listen for online users updates
    socket.on("getOnlineUsers", (onlineUserIds: string[]) => {
      setOnlineUsers(onlineUserIds);

      // Update sidebar users with online status
      setSidebarUsers((prev) =>
        prev.map((user) => ({
          ...user,
          online: onlineUserIds.includes(user.userId),
        }))
      );
    });

    // Listen for chat users list
    socket.on("chatUsersList", (users: SidebarUser[]) => {
      setSidebarUsers(users);
    });

    // Listen for new messages
    socket.on("receiveMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);
      // Update chat users list
      socket.emit("getChatUsers", currentUserId);
    });

    // Listen for message updates
    socket.on("messageUpdated", (updatedMessage: Message) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === updatedMessage._id ? updatedMessage : msg
        )
      );
    });

    // Listen for message deletions
    socket.on("messageDeleted", ({ messageId }) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    });

    return () => {
      socket.off("getOnlineUsers");
      socket.off("chatUsersList");
      socket.off("receiveMessage");
      socket.off("messageUpdated");
      socket.off("messageDeleted");
    };
  }, [currentUserId]);

  console.log(messages, "ms");

  useEffect(() => {
    if (selectedUser && currentUserId) {
      socket.emit("getMessages", {
        currentUserId,
        selectedUserId: selectedUser.userId,
      });
    }
  }, [selectedUser, currentUserId]);

  // Listen for messages list
  useEffect(() => {
    socket.on("messagesList", (messages: Message[]) => {
      setMessages(messages);
    });

    return () => {
      socket.off("messagesList");
    };
  }, []);

  const filteredUsers = sidebarUsers.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAttachFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSendingImages(files.slice(0, 5));
    setImagePreview(files.length ? URL.createObjectURL(files[0]) : null);
    setPreviewFile(files[0] || null);
    event.target.value = "";
  };

  const handleSendMessage = async () => {
    if (
      (!messageInput.trim() && sendingImages.length === 0) ||
      !selectedUser ||
      !currentUserId
    )
      return;

    setIsSending(true);

    console.log(sendingImages, "ss");
    socket.emit("sendMessage", {
      senderId: currentUserId,
      receiverId: selectedUser.userId,
      text: messageInput,
      // images: sendingImages.map((file) => file.name),
    });

    setMessageInput("");
    setSendingImages([]);
    setImagePreview(null);
    setPreviewFile(null);
    setIsSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleImageClick = (images: string[], idx: number) => {
    setModalImages(images);
    setModalStartIndex(idx);
    setImageModalOpen(true);
  };

  const handleEditMessage = (msg: Message) => {
    setEditMessageId(msg._id);
    setEditMessageText(msg.text || "");
  };

  const handleSaveEdit = async () => {
    if (!editMessageId || !selectedUser || !currentUserId) return;

    socket.emit("updateMessage", {
      messageId: editMessageId,
      newText: editMessageText,
      currentUserId,
      selectedUserId: selectedUser.userId,
    });

    setEditMessageId(null);
    setEditMessageText("");
  };

  const handleDeleteMessage = async (msgId: string) => {
    if (!selectedUser || !currentUserId) return;

    socket.emit("deleteMessage", {
      messageId: msgId,
      currentUserId,
      selectedUserId: selectedUser.userId,
    });
  };

  const cancelImagePreview = () => {
    setImagePreview(null);
    setPreviewFile(null);
  };

  const selectUser = (user: SidebarUser) => {
    setSelectedUser(user);
    setShowSidebar(false);
  };

  const getInitial = (name: string) =>
    name && name.length > 0 ? name[0].toUpperCase() : "?";

  const isUserOnline = (userId: string) => {
    return onlineUsers.includes(userId);
  };

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 p-2 bg-white rounded-lg shadow-md"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <div
        className={`w-80 bg-white border-r border-gray-200 flex flex-col fixed md:relative z-10 h-full transition-transform duration-300 ease-in-out ${
          showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <div className="p-4 text-gray-500 text-center">No users found</div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.userId}
                className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                  selectedUser?.userId === user.userId ? "bg-blue-50" : ""
                }`}
                onClick={() => selectUser(user)}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-700">
                    {getInitial(user.fullName)}
                  </div>
                  {/* Online status indicator */}
                  {user.online && (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">
                      {user.fullName}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {user.lastTime
                        ? new Date(user.lastTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {user.lastMessage}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col h-full">
        {selectedUser ? (
          <>
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center">
                <button
                  className="md:hidden mr-2 p-1 hover:bg-gray-100 rounded-full"
                  onClick={() => setShowSidebar(true)}
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-700">
                    {getInitial(selectedUser.fullName)}
                  </div>
                  {/* Online status indicator in header */}
                  {selectedUser.online && (
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900">
                    {selectedUser.fullName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedUser.online
                      ? "Online"
                      : selectedUser.lastSeen
                      ? "Last seen " +
                        new Date(selectedUser.lastSeen).toLocaleString()
                      : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Video className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-4 bg-gray-50 overflow-y-auto">
              {messages?.length === 0 ? (
                <div className="text-center text-gray-400 mt-10">
                  No messages yet
                </div>
              ) : (
                messages?.map((message) => {
                  const isOwnMessage =
                    message.sender === currentUserId ||
                    message.sender?._id === currentUserId;
                  const hasText = !!message.text;
                  const hasImage = message.image && message.image.length > 0;

                  return (
                    <div
                      key={message._id}
                      className={`flex ${
                        isOwnMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`relative group max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                          isOwnMessage
                            ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white"
                            : "bg-white text-gray-800 border border-gray-200"
                        }`}
                      >
                        {/* Images */}
                        {hasImage && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {message.image.map((img, idx) => (
                              <img
                                key={idx}
                                src={baseUrlImg + img}
                                alt={`msg-img-${idx}`}
                                className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-90"
                                onClick={() =>
                                  handleImageClick(message.image!, idx)
                                }
                              />
                            ))}
                          </div>
                        )}

                        {/* Text or Edit */}
                        {editMessageId === message._id ? (
                          <div className="flex flex-wrap items-center gap-2 bg-gray-100 rounded p-2 shadow-inner">
                            <input
                              className="border text-black border-blue-400 rounded px-2 py-1 text-sm flex-1 focus:ring-2 focus:ring-blue-400 outline-none"
                              value={editMessageText}
                              onChange={(e) =>
                                setEditMessageText(e.target.value)
                              }
                              autoFocus
                              disabled={isSending}
                            />
                            <button
                              className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition font-semibold disabled:opacity-50"
                              onClick={handleSaveEdit}
                              disabled={isSending || !editMessageText.trim()}
                            >
                              Save
                            </button>
                            <button
                              className="text-gray-500 hover:text-red-500 px-2 py-1 rounded"
                              onClick={() => setEditMessageId(null)}
                              disabled={isSending}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : hasText ? (
                          <div className="px-2 py-1">
                            <p className="text-sm break-words whitespace-pre-line">
                              {message.text}
                            </p>
                          </div>
                        ) : null}

                        <div className="px-2 pb-1 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <p
                              className={`text-xs ${
                                isOwnMessage ? "text-blue-100" : "text-gray-500"
                              }`}
                            >
                              {new Date(message.createdAt).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                            {message.edited && (
                              <span
                                className={`text-xs ${
                                  isOwnMessage
                                    ? "text-blue-100"
                                    : "text-gray-400"
                                }`}
                              >
                                edited
                              </span>
                            )}
                          </div>

                          {/* Edit/Delete options (show only for your own messages) */}
                          {isOwnMessage && (
                            <span className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {/* Only show edit if message has text */}
                              {hasText && (
                                <button
                                  className="p-1 rounded-full"
                                  onClick={() => handleEditMessage(message)}
                                  title="Edit"
                                  disabled={isSending}
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                              )}
                              {/* Always show delete for own messages */}
                              <button
                                className="p-1 rounded-full"
                                onClick={() => handleDeleteMessage(message._id)}
                                title="Delete"
                                disabled={isSending}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {imageModalOpen && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
                onClick={() => setImageModalOpen(false)} // 🟢 Outside click closes modal
              >
                <div
                  className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-4 relative"
                  onClick={(e) => e.stopPropagation()} // 🔴 Inside click doesn't close modal
                >
                  <Carousel
                    additionalTransfrom={0}
                    arrows
                    autoPlaySpeed={3000}
                    centerMode={false}
                    className=""
                    containerClass="carousel-container"
                    draggable
                    infinite={false}
                    keyBoardControl
                    minimumTouchDrag={80}
                    responsive={{
                      desktop: {
                        breakpoint: { max: 3000, min: 1024 },
                        items: 1,
                      },
                      tablet: { breakpoint: { max: 1024, min: 640 }, items: 1 },
                      mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
                    }}
                    showDots={true}
                    slidesToSlide={1}
                    swipeable
                    customTransition="all .3"
                    transitionDuration={300}
                    focusOnSelect={false}
                    partialVisible={false}
                    renderDotsOutside={false}
                    customLeftArrow={null}
                    customRightArrow={null}
                    ssr={true}
                    itemClass="flex justify-center"
                    initialSlide={modalStartIndex}
                  >
                    {modalImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="flex justify-center items-center h-96"
                      >
                        <img
                          src={baseUrlImg + img}
                          alt={baseUrlImg + img}
                          className="max-h-96 max-w-full rounded-lg shadow"
                        />
                      </div>
                    ))}
                  </Carousel>
                </div>
              </div>
            )}

            {/* Image Preview */}
            {imagePreview && (
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Image Preview</h4>
                  <button
                    onClick={cancelImagePreview}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{previewFile?.name}</p>
                    <p className="text-xs text-gray-500">
                      {previewFile?.size
                        ? `${(previewFile.size / 1024).toFixed(1)} KB`
                        : ""}
                    </p>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-2">
              <div className="flex items-center space-x-3">
                {/* <button
                  onClick={handleAttachFile}
                  className="p-2 hover:bg-gray-100 rounded-full"
                  disabled={sendingImages.length >= 5}
                  title={sendingImages.length >= 5 ? "Maximum 5 images" : ""}
                >
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button> */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                  multiple
                  disabled={sendingImages.length >= 5}
                />
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isSending}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  className={`p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center ${
                    isSending ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  disabled={isSending}
                >
                  {isSending ? (
                    <span className="loader border-2 border-blue-200 border-t-blue-600 rounded-full w-5 h-5 animate-spin"></span>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center p-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500">
                Choose a user from the sidebar to start messaging
              </p>
              <button
                className="mt-4 md:hidden px-4 py-2 bg-blue-500 text-white rounded-lg"
                onClick={() => setShowSidebar(true)}
              >
                Open Contacts
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
