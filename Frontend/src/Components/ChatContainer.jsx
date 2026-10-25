import { useContext, useState, useEffect, useRef, useMemo } from 'react'
import assets from '../assets/assets.js';
import { ChatContext } from '../../context/ChatContext.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const ChatContainer = () => {
  const { messages, selectedChat, sendMessages, getMessages, otherUser, setOtherUser, setSelectedChat } = useContext(ChatContext);
  const { authUser, onlineUsers, setPage, page, socket } = useContext(AuthContext);
  const scrollEnd = useRef();
  const [input, setInput] = useState('');
  const msgTime = (msg) => {
    const date = new Date(msg.createdAt);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const membersMap = useMemo(() => {
    const map = {};
    selectedChat?.participant?.forEach((p) => {
      map[p.user._id] = p.user;
    });
    return map;
  }, [selectedChat]);

  //Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return null;
    await sendMessages({ text: input.trim() });
    setInput("");
  }

  //Handle sending an image
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("select and image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessages({ image: reader.result })
      e.target.value = "";
    }
    reader.readAsDataURL(file);
  }
  useEffect(() => {
    if (selectedChat) {
      getMessages(selectedChat._id);
    }
  }, [selectedChat])

  useEffect(() => {
    if (!socket || !selectedChat?._id) return;
    // socket.emit("joinRoom", selectedChat._id);
    if (selectedChat.isGroup) {
      setOtherUser(selectedChat.participant.filter((p) => p.user._id !== authUser._id))
    }
    else {
      setOtherUser(selectedChat.participant.find((p) => p.user._id !== authUser._id)?.user)
    }
  }, [socket, selectedChat]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return selectedChat ? (
    <div className={`${page === "chatcontainer" ? "flex" : "hidden"} bg-(--border) rounded-lg py-2 md:px-4 md:flex flex-col h-full overflow-scroll relative`}>
      <div className='px-5 py-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2 mb-3'>
            <i className="fa-solid fa-arrow-left block! md:hidden!" onClick={() => { setPage("sidebar"); setSelectedChat(null); setOtherUser(null) }}></i>
            <img src={selectedChat.isGroup ? selectedChat.groupProfilePic || assets.groupicon : otherUser?.profilePic || assets.profile} className='h-10 w-10 rounded-full md:h-13 md:w-13 ' alt="" />
            <div>
              <h1>{selectedChat.isGroup ? selectedChat.name : otherUser?.fullName}</h1>
              {selectedChat.isGroup ? (
                <p className='text-sm'>
                  {selectedChat.participant.length} members
                </p>
              ) : otherUser && onlineUsers.includes(otherUser._id) ? (
                <div className='text-green-500 text-sm'>online</div>
              ) : (
                <p className='text-sm'>offline</p>
              )}
            </div>
          </div>
          <i className="fa-solid fa-circle-info md:hidden! block! mb-3" onClick={() => setPage("media")}></i>
        </div>
        <hr className='text-(--text)' />
      </div>
      <div className='flex flex-col h-full overflow-scroll px-5 py-1 gap-3'>
        {
          messages.map((msg, index) => {
            const senderId = typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId
            const isMe = senderId === authUser._id;
            const sender = membersMap[senderId];
            const showSender = selectedChat.isGroup && !isMe;
            return (
              <div key={msg._id} className={`flex items-center gap-2 text-xs ${!isMe && "flex-row-reverse"}`}>

                {showSender && (
                  <img
                    src={sender?.profilePic || assets.profile}
                    className='h-7 w-7 rounded-full md:h-10 md:w-10 self-end'
                    alt=""
                  />
                )}

                {/* <div className='flex flex-col gap-2 items-center'>
                  {selectedChat.isGroup && (msg.senderId._id === authUser._id ? "" : <img src={otherUser.find((p) => p.user._id === msg.senderId._id)?.profilePic || assets.profile} className='h-7 w-7 rounded-full md:h-10 md:w-10' alt="" />)}
                </div> */}
                <div className={`relative flex flex-col break-all rounded-lg max-w-[90%] ${isMe ? "bg-(--accent) text-black received" : "bg-(--code-bg) sent"}`}>

                  {showSender && (
                    <div className='text-xs font-bold rounded-t-lg pt-1 md:pt-2 pl-1 md:pl-2 pr-10 text-white'>
                      {sender?.fullName || "Unknown"}
                    </div>
                  )}

                  <div className='relative text-sm px-1 py-1 md:px-2 md:py-2 rounded-b-lg z-10 '>
                    {msg.image ? (<img src={msg.image} alt='' className='max-w-60 md:max-w-57.5 overflow-hidden rounded-lg' />) : (<p className='pr-12 rounded-b-lg whitespace-normal break-keep overflow-wrap-anywhere'>{msg.text}</p>)}
                    <p className='absolute bottom-0 right-1 md:bottom-1 md:right-2 text-[10px]'>{msgTime(msg)}</p>
                  </div>
                </div>
              </div>
            )
          })
        }
        <div ref={scrollEnd}></div>
      </div>
      <div className='flex gap-4 px-2'>
        <div className='flex bg-(--code-bg) rounded-full pr-4 pl-2 md:px-4 w-full items-center h-10 md:h-12'>
          <input onChange={(e) => setInput(e.target.value)} value={input} onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null} type="text" placeholder='Message' className='px-1 md:px-2 w-full outline-none ' />
          <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/jpeg' hidden />
          <label htmlFor="image">
            <i className="fa-solid fa-upload"></i>
          </label>
        </div>
        <img onClick={handleSendMessage} src={assets.send} className='h-10 md:h-12 w-12 bg-(--accent) rounded-full p-2' alt="" />
      </div>
    </div>
  ) :
    (
      <div className='hidden md:flex flex-col items-center justify-center'>
        <img className='h-30 w-40' src={assets.logo} alt="" />
        <h1 className='text-xl'>Chat anytime, anywhere</h1>
      </div>
    )
}

export default ChatContainer
