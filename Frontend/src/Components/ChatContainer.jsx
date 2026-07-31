import { useContext, useState, useEffect, useRef } from 'react'
import assets from '../assets/assets.js'
import { ChatContext } from '../../context/ChatContext.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessages, getMessages } = useContext(ChatContext)
  const { authUser, onlineUsers, setPage, page } = useContext(AuthContext);
  const scrollEnd = useRef();
  const navigate = useNavigate();

  const [input, setInput] = useState('');

  const msgTime = (msg) => {
    const date = new Date(msg.createdAt);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

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
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser])

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages])

  return selectedUser ? (
    <div className={`${page === "chatcontainer" ? "flex" : "hidden"} bg-(--border) rounded-lg py-2 md:px-4 md:flex flex-col h-full overflow-scroll relative`}>
      <div className='px-5 py-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2 mb-3'>
            <i className="fa-solid fa-arrow-left block! md:hidden!" onClick={()=>setPage("sidebar")}></i>
            <img src={selectedUser.profilePic || assets.profile} className='h-10 w-10 rounded-full md:h-13 md:w-13 ' alt="" />
            <div>
            <h1>{selectedUser.fullName}</h1>
            {onlineUsers.includes(selectedUser._id) ? <div className='text-green-500 text-sm'>online</div> : <p className='text-sm'>offline</p>}
            </div>
          </div>
          <i className="fa-solid fa-circle-info md:hidden! block! mb-3" onClick={() => setPage("media")}></i>
        </div>
        <hr className='text-(--text)' />
      </div>
      <div className='flex flex-col h-full overflow-scroll px-5 py-1 gap-3'>
        {
          messages.map((msg, index) => {
            return (
              <div key={index} className={`flex items-center gap-2 text-xs ${msg.senderId !== authUser._id && "flex-row-reverse"}`}>
                <div className='flex flex-col gap-2 items-center'>
                  {/* <img src={msg.senderId === selectedUser._id ? selectedUser.profilePic : authUser.profilePic || assets.profile} className='h-10 w-10 rounded-full md:h-15 md:w-15' alt="" /> */}
                </div>
                <div className={`relative flex flex-col break-all rounded-lg max-w-[90%] ${msg.senderId === authUser._id ? "bg-(--accent) text-black received" : "bg-(--code-bg) sent"}`}>
                  {msg.senderId === selectedUser._id && <div className='text-xs font-bold rounded-t-lg pt-1 md:pt-2 pl-1 md:pl-2 pr-10 text-(--accent)'>{selectedUser.fullName}</div>}
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
