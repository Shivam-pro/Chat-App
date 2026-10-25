import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext';

const RightSidebar = () => {
  const { selectedChat, messages } = useContext(ChatContext);
  const { logout, onlineUsers, page, setPage, authUser } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);

  // Get all the images from the messages and set them to the state
  useEffect(()=>{
    setMsgImages(
      messages.filter(msg => msg.image).map(msg=>msg.image)
    );
  },[messages])


  return (
    <div className={`${page === "media" ? "flex" : "hidden"} md:flex flex-col bg-(--border) rounded-lg py-2 px-4 h-full overflow-scroll relative`}>
      <i className="fa-solid fa-arrow-left absolute top-4 block! md:hidden!" onClick={()=>setPage("chatcontainer")}></i>
      <div className='flex flex-col gap-2 items-center py-4 px-5'>
        <img src={selectedChat.isGroup ? selectedChat.groupProfilePic : selectedChat.participant.find((user) => user._id !== authUser._id)?.profilePic || assets.profile} className='h-30 w-30 rounded-full' alt="" />
        <div className='flex items-center gap-2 text-xl'>
          {onlineUsers.includes(selectedChat._id) && <div className='h-2 w-2 bg-green-500 rounded-2xl'></div>}
          <h1>{selectedChat.isGroup ? selectedChat.name : selectedChat.participant.find((user) => user._id !== authUser._id)?.fullName}</h1>
        </div>
        <h3 className='text-sm'>{selectedChat.isGroup ? selectedChat.name : selectedChat.participant.find((user) => user._id !== authUser._id)?.bio}</h3>
      </div>
      <hr className='text-(--text)' />
      <h1 className='my-2'>Media</h1>
      <div className='grid grid-cols-2 overflow-y-scroll gap-y-4 mb-3 h-full'>
        {msgImages.map((image, index) => (
          <img key={index} src={image} className='h-31 w-31' onClick={() => window.open(image)} />
        ))}
      </div>
      <button onClick={()=>logout()} className='bg-(--accent) py-2 px-4 text-black rounded-full w-1/2 mx-auto cursor-pointer'>Logout</button>
    </div>
  )
}

export default RightSidebar
