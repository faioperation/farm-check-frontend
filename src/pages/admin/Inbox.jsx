import React, { useState, useEffect, useRef, useCallback } from "react";
import { AiFillPicture, AiOutlineFile } from "react-icons/ai";
import { FaArrowRight, FaFileDownload } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import { FiMessageSquare, FiTrash2, FiX } from "react-icons/fi";
import { IoSend } from "react-icons/io5";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { useSocket } from "../../provider/SocketProvider";
import { BASE_URL } from "../../config/api";

import { useSearchParams } from "react-router-dom";

export default function Inbox() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { socket, error } = useSocket();
  const currentUserRole = "admin";

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get("conversation");

  const setSelectedId = (id) => {
      const newParams = new URLSearchParams(searchParams);
      if (id) {
          newParams.set("conversation", id);
      } else {
          newParams.delete("conversation");
      }
      setSearchParams(newParams);
  };

  const [newMessage, setNewMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // Contact search state
  const [contactResults, setContactResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null); // contact from search
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  // Ref for the bottom of the message list
  const messagesEndRef = useRef(null);

  // Helper: Scroll to bottom
  const scrollToBottom = (behavior = "smooth") => {
    // Timeout ensures images/DOM are rendered before scrolling
    setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: behavior, block: "end" });
    }, 100);
  };

  // Helper: Get full URL
  const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http") || path.startsWith("blob:")) return path;
    
    // Check if BASE_URL ends with /api and strip it for static files
    // Assuming uploads are served from root, not /api/uploads
    let rootUrl = BASE_URL;
    if (rootUrl.endsWith("/api")) {
        rootUrl = rootUrl.slice(0, -4);
    } else if (rootUrl.endsWith("/api/")) {
        rootUrl = rootUrl.slice(0, -5);
    }

    const cleanBase = rootUrl.replace(/\/$/, "");
    // Replace backslashes with forward slashes for Windows paths
    const cleanPath = path.replace(/\\/g, "/").replace(/^\//, "");
    return `${cleanBase}/${cleanPath}`;
  };

  // Helper: Get file type
  const getFileType = (url) => {
    if (!url) return "unknown";
    if (url.startsWith("blob:")) return "image"; 

    try {
        const extension = url.split(".").pop().toLowerCase();
        const videoExts = ["mp4", "webm", "ogg", "mov"];
        const imageExts = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"];
        
        if (videoExts.includes(extension)) return "video";
        if (imageExts.includes(extension)) return "image";
        return "file";
    } catch (e) {
        return "file";
    }
  };

  // =========================
  //    GET CONVERSATIONS
  // =========================
  const { data: conversations = [] } = useQuery({
    queryKey: ["inboxConversations"],
    queryFn: async () => {
      const res = await axiosSecure.get("/farm-admin/messages/inbox");
      const raw = res.data.data || [];

      return raw
        .map((item) => ({
          id: item.userId,
          name: item.name,
          role: item.role || "User",
          avatar: item.name?.charAt(0),
          unread: item.unreadCount > 0,
          lastMessage: item.lastMessage,
          lastMessageAt: item.lastMessageAt,
        }))
        .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
    },
  });

  // =========================
  //    GET MESSAGES FOR SELECTED CONVERSATION
  // =========================
  const { data: messages = [] } = useQuery({
    queryKey: ["conversationMessages", selectedId],
    queryFn: async () => {
        if (!selectedId) return [];
        const res = await axiosSecure.get(`/farm-admin/messages/history/${selectedId}`);
        const data = res.data.data || [];
        // Sort messages: Oldest first (ASC) for chat view
        return data
          .map((msg) => {
            const imgUrl = msg.imageUrl ? getFullUrl(msg.imageUrl) : msg.image;
            // console.log("Mapped Message Image:", imgUrl); // Debugging
            return {
                ...msg,
                image: imgUrl,
            };
          })
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    },
    enabled: !!selectedId, 
  });

  // =========================
  // 🔌 SOCKET LISTENERS & AUTO SCROLL
  // =========================
  
  // 1. Scroll instantly when conversation changes (or loads)
  useEffect(() => {
      scrollToBottom("auto");
  }, [selectedId, messages.length]); 

  // 2. WebSocket Listener
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (data) => {
      // 1. Validate data
      if (!data) return;
      console.log("🔔 Socket received (new_message):", data);
      console.log("BASE_URL:", BASE_URL); // Debugging

      // 2. Extract IDs robustly (handle object with _id, id, or string)
      const getSafeId = (userObj) => {
        if (!userObj) return null;
        if (typeof userObj === "string") return userObj;
        return userObj.id || userObj._id || userObj.userId;
      };

      const msgSenderId = getSafeId(data.sender) || data.senderId;
      const msgReceiverId = getSafeId(data.receiverId) || data.receiver?.id || data.receiver?._id;

      const constructedUrl = data.imageUrl ? getFullUrl(data.imageUrl) : data.image;
      console.log("Constructed Socket URL:", constructedUrl); // Debugging

      // 3. Normalize for Frontend (ensure senderId exists for render logic)
      const normalizedMessage = {
          ...data,
          senderId: msgSenderId,     // Ensure these exist for UI logic
          receiverId: msgReceiverId,
          image: constructedUrl,
      };

      // 4. ALWAYS update the inbox list sidebar
      queryClient.invalidateQueries(["inboxConversations"]);

      // 5. Update the ACTIVE chat only if it matches
      const isRelated = 
         String(msgSenderId) === String(selectedId) || 
         String(msgReceiverId) === String(selectedId);

      if (isRelated) {
        queryClient.setQueryData(
          ["conversationMessages", selectedId],
          (old = []) => {
            const exists = old.some((m) => m.id === normalizedMessage.id);
            if (exists) return old;
            return [...old, normalizedMessage];
          }
        );
        scrollToBottom("smooth");
      }
    };

    // Listen for the correct event name from backend
    socket.on("new_message", handleMessage);

    return () => {
      socket.off("new_message", handleMessage);
    };
  }, [socket, selectedId, queryClient]);
  const sendMutation = useMutation({
    mutationFn: async () => {
      // 1. FILE UPLOAD: Use Axios (HTTP)
      // Backend likely doesn't support binary file upload via this specific socket event yet
      if (selectedFile) {
          const formData = new FormData();
          formData.append("receiverId", selectedId);
          formData.append("content", newMessage || " "); 
          formData.append("image", selectedFile);

          return await axiosSecure.post("/farm-admin/messages", formData);
      }

      // 2. TEXT MESSAGE: Use Socket (Real-time)
      // We use socket.emit because the backend broadcasting logic is tied to the 'send_message' event
      if (!socket) throw new Error("Socket not connected");

      return new Promise((resolve) => {
        socket.emit("send_message", {
          content: newMessage,
          receiverId: selectedId,
        });
        // We resolve immediately/optimistically or could wait for ack if backend supported it
        resolve({ data: { success: true } });
      });
    },
    onSuccess: (res) => {
      console.log("✅ Message sent success:", res); // Debug log
      // 1. Handle File Upload Success (HTTP)
      // Since HTTP doesn't broadcast, we MUST manually add the message to the UI
      const sentMessage = res?.data?.data; 
      if (sentMessage) {
        const normalizedSentMessage = {
            ...sentMessage,
            image: sentMessage.imageUrl ? getFullUrl(sentMessage.imageUrl) : sentMessage.image,
        };
        queryClient.setQueryData(
          ["conversationMessages", selectedId],
          (old = []) => [...old, normalizedSentMessage]
        );
        // Also update sidebar to show "sent a photo" etc
        queryClient.invalidateQueries(["inboxConversations"]);
      }

      // 2. Clear Inputs
      setNewMessage("");
      setSelectedFile(null);
      setImagePreview(null);
      scrollToBottom("smooth");
    },
    onError: (err) => {
      console.error("    Message send error:", err);
      toast.error("Failed to send message");
    },
  });

  // =========================
  //    CLEAR CHAT HISTORY
  // =========================
  const clearHistoryMutation = useMutation({
    mutationFn: async (userId) => {
      return await axiosSecure.delete(`/farm-admin/messages/history/${userId}`);
    },
    onSuccess: () => {
      queryClient.setQueryData(["conversationMessages", selectedId], []);
      queryClient.invalidateQueries(["inboxConversations"]);
      toast.success("Chat history cleared");
    },
    onError: () => {
      toast.error("Failed to clear chat history");
    },
  });


  const selectedConversation =
    conversations.find((c) => c.id === selectedId) ||
    // Fallback: if contact was picked from search but no existing conversation yet
    (selectedId && selectedContact?.id === selectedId
      ? {
          id: selectedContact.id,
          name: selectedContact.name,
          role: selectedContact.role || selectedContact.jobTitle || "",
          avatar: selectedContact.name?.charAt(0),
          unread: false,
          lastMessage: null,
          lastMessageAt: null,
        }
      : null);

  const filteredConversations = search.trim()
    ? conversations.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      )
    : conversations;

  // Debounced contact search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setContactResults([]);
      setShowDropdown(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await axiosSecure.get(`/farm-admin/messages/contacts?search=${encodeURIComponent(value.trim())}`);
        const results = res.data?.data || [];
        setContactResults(results);
        setShowDropdown(true);
      } catch (err) {
        console.error("Contact search error:", err);
        setContactResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  };

  const handleContactSelect = (contact) => {
    setShowDropdown(false);
    setSearch("");
    setContactResults([]);
    setSelectedContact(contact); // store contact info as fallback
    setSelectedId(contact.id);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // ===============================
  //    INBOX VIEW (DESIGN UNCHANGED)
  // ===============================
  if (!selectedConversation) {
    return (
      <>
        <div className="relative mb-6 bg-white rounded-lg border-2 border-[#E5E7EB] p-6" ref={searchRef}>
          <FaSearch className="absolute top-1/2 -translate-y-1/2 left-10 text-[#99A1AF]" />
          {isSearching && (
            <div className="absolute top-1/2 -translate-y-1/2 right-10">
              <div className="w-4 h-4 border-2 border-[#F6A62D] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <input
            value={search}
            onChange={handleSearchChange}
            onFocus={() => contactResults.length > 0 && setShowDropdown(true)}
            type="text"
            placeholder="Search contacts..."
            className="w-full pl-10 p-4 border border-[#D1D5DC] rounded-md outline-none text-[#0A0A0A]/50 placeholder:text-[#0A0A0A]/50"
          />

          {/* Contact Search Dropdown */}
          {showDropdown && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
              {contactResults.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-400 text-center">No contacts found</div>
              ) : (
                contactResults.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => handleContactSelect(contact)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-[#F3F4F6] last:border-b-0 transition-colors"
                  >
                    {contact.avatarUrl ? (
                      <img
                        src={contact.avatarUrl}
                        alt={contact.name}
                        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0"
                      style={{ display: contact.avatarUrl ? "none" : "flex" }}
                    >
                      {contact.name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0A0A0A] truncate">{contact.name}</p>
                      <p className="text-xs text-gray-400 truncate">{contact.jobTitle || contact.role}</p>
                    </div>
                    <span className="text-xs text-[#F6A62D] font-medium flex items-center gap-1">Message <FaArrowRight/></span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="bg-white border rounded-lg">
          <div className="px-4 py-5 border-b border-[#0a0a0a]/10 text-[#0A0A0A] flex items-center gap-2">
            <div className="flex items-center gap-2">
                 {/* Connection Status Dot */}
                 <div 
                    // className={`w-3 h-3 rounded-full ${socket?.readyState === 1 ? "bg-green-500" : "bg-red-500"}`} 
                    title={socket?.readyState === 1 ? "Connected" : (error || "Disconnected")}
                 />
                 {/* Debug Error Message (Visible on Hover or if Error) */}
                 {error && <span className="text-xs text-red-500 max-w-[150px] truncate" title={error}>{error}</span>}
                 
                 <FiMessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold">Inbox</h3>
          </div>

          <div className="h-[535px] overflow-y-scroll hide-scrollbar">
            {filteredConversations.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`flex items-start gap-4 px-4 py-5 border-b cursor-pointer
                  ${
                    c.unread
                      ? "bg-orange-50 hover:bg-orange-100"
                      : "hover:bg-gray-50"
                  }
                `}
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                  {c.avatar}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-[#0A0A0A]">{c.name}</p>
                    <p className="text-gray-400 text-sm">{c.role}</p>
                    </div>
                    <span className="text-sm text-gray-400">
                      {new Date(c.lastMessageAt).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-2">
                    {c.lastMessage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  const manager = selectedConversation.name;

  // ===============================
  // 💬 CONVERSATION VIEW (DESIGN UNCHANGED)
  // ===============================
  return (
    <>
    <div className="flex flex-col  rounded-lg h-[740px]">
      <div className="flex items-center gap-3 px-4 py-5 border-b bg-white">
        <button
          onClick={() => setSelectedId(null)}
          className="text-xl text-[#0A0A0A]"
        >
          <FaArrowLeft />
        </button>

        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
          {selectedConversation.avatar}
        </div>

        <div className="flex-1">
          <p className="font-medium text-sm text-[#0A0A0A]">
            {selectedConversation.name}
          </p>
          <p className="text-xs text-gray-500">
            {selectedConversation.role}
          </p>
        </div>

        {/* Delete / Clear History Button */}
        <button
          onClick={() => setShowDeleteModal(true)}
          disabled={clearHistoryMutation.isPending}
          title="Clear chat history"
          className="ml-auto text-red-400 hover:text-red-600 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <FiTrash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto hide-scrollbar">
        {messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">
            Start messaging {manager}
            </div>
        ) : (
            messages.map((msg, index) => {
                const isMe = msg.senderId === "admin" || !msg.senderId; // Adjust logic based on real ID
                // For now, assuming if it's not from the selected user, it's from me
                const isRightSide = msg.senderId !== selectedId; 

                return (
                    <div key={index} className={`flex ${isRightSide ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[20%] ${isRightSide ? "text-right" : "text-left"}`}>
                            <div className={`px-4 py-2 rounded-lg text-base ${isRightSide ? "bg-[#F6A62D] text-white rounded-br-none" : "bg-[#F3F4F6] text-[#101828] rounded-bl-none"}`}>
                                {msg.image && (
                                    <div className="mb-2">
                                        {(() => {
                                            const fileType = getFileType(msg.image);
                                            return (
                                                <>
                                                 {fileType === "video" ? (
                                                     <video src={msg.image} controls className="max-w-full rounded-md" />
                                                 ) : fileType === "image" ? (
                                                     <img 
                                                         src={msg.image} 
                                                         alt="attachment" 
                                                         className="max-w-full rounded-md" 
                                                         onError={(e) => {
                                                             e.target.style.display = 'none';
                                                             e.target.nextSibling.style.display = 'flex';
                                                         }}
                                                     />
                                                 ) : (
                                                     <a 
                                                         href={msg.image} 
                                                         target="_blank" 
                                                         rel="noopener noreferrer" 
                                                         className="flex items-center gap-2 p-2 bg-black/10 rounded hover:bg-black/20 text-inherit no-underline"
                                                     >
                                                         <AiOutlineFile className="text-xl" />
                                                         <span className="text-sm underline">Download Attachment</span>
                                                     </a>
                                                 )}
                                                 {/* Fallback for broken images */}
                                                 <div className="hidden flex-col items-center justify-center p-4 bg-black/5 rounded border border-dashed border-black/20">
                                                     <span className="text-xs mb-1 opacity-70">Image failed to load</span>
                                                     <a 
                                                         href={msg.image} 
                                                         target="_blank" 
                                                         rel="noopener noreferrer"
                                                         className="flex items-center gap-1 text-xs underline"
                                                     >
                                                         <FaFileDownload /> Download
                                                     </a>
                                                 </div>
                                                </>
                                            );
                                        })()}
                                         
                                    </div>
                                )}
                                {msg.content}
                                <p className="text-xs mt-1 opacity-70 text-right">{new Date(msg.createdAt || Date.now()).toLocaleTimeString()}</p>
                            </div>
                        </div>
                    </div>
                )
            })
        )}
        <div ref={messagesEndRef} />
      </div>

      {currentUserRole === "admin" && (
        <div className="p-4 border-t space-y-2">
          {imagePreview && (
            <div className="relative w-25 h-25  overflow-hidden">
             {selectedFile?.type.startsWith("video/") ? (
                 <video src={imagePreview} className="rounded-md border w-full h-full object-cover" controls={false} />
             ) : (
                <img src={imagePreview} alt="" className="rounded-md border w-full h-full object-cover" />
             )}
              
              <button
                onClick={() => {
                    setImagePreview(null);
                    setSelectedFile(null);
                }}
                className="absolute top-0 right-0 bg-[#F6A62D] text-white w-5 h-5 rounded-full text-sm flex items-center justify-center cursor-pointer"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex gap-2 px-1.5 items-center border border-[#0A0A0A]/10 rounded-full">
            <label className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full bg-[#F6A62D]">
              <input
                type="file"
                accept="image/*, video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                      setSelectedFile(file);
                      setImagePreview(URL.createObjectURL(file));
                  }
                }}
              />
              <AiFillPicture className="w-5 h-5" />
            </label>

            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (newMessage.trim() || selectedFile) sendMutation.mutate();
                }
              }}
              className="flex-1  text-[#0A0A0A] rounded-md px-3 py-3 outline-0"
              placeholder="Type message..."
            />

            <button
              onClick={() => {
                if (newMessage.trim() || selectedFile) sendMutation.mutate();
              }}
              className="bg-[#F6A62D] rounded-full text-white px-2 py-2 cursor-pointer"
            >
              <IoSend className="w-5 h-5 " />
            </button>
          </div>
        </div>
      )}
    </div>

      {/* ===== DELETE CONFIRM MODAL ===== */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            {/* Top red bar */}
            <div className="bg-[#F6A62D] px-6 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <FiTrash2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg">Clear Chat History</h3>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <p className="text-[#374151] text-sm ">
                Are you sure you want to clear all chat history with{" "}
                <span className="font-semibold text-[#0A0A0A]">{selectedConversation.name}</span>?
              </p>
              <p className="text-xs text-gray-400 mt-1">This action cannot be undone.</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-lg border border-[#D1D5DC] text-[#374151] text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearHistoryMutation.mutate(selectedId);
                  setShowDeleteModal(false);
                }}
                disabled={clearHistoryMutation.isPending}
                className="flex-1 py-2.5 rounded-lg bg-[#F6A62D] hover:bg-[#F6A62D]/80 text-white text-sm font-medium transition-colors disabled:opacity-60 cursor-pointer"
              >
                {clearHistoryMutation.isPending ? "Clearing..." : "Yes, Clear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
