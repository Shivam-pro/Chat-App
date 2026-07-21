import React, { useContext, useEffect, useState } from 'react'
import assets, { mediaData } from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext';

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers, show, setShow } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);

  // Get all the images from the messages and set them to the state
  useEffect(()=>{
    setMsgImages(
      messages.filter(msg => msg.image).map(msg=>msg.image)
    );
  },[messages])


  return (
    <div className={`${selectedUser && !show ? "hidden" : "flex"} md:flex flex-col bg-(--border) rounded-lg py-2 px-4 h-full overflow-scroll relative`}>
      <i className="fa-solid fa-arrow-left absolute top-4 block! md:hidden!" onClick={()=>setShow(false)}></i>
      <div className='flex flex-col gap-2 items-center py-4 px-5'>
        <img src={selectedUser?.profilePic || assets.profile} className='h-30 w-30 rounded-full' alt="" />
        <div className='flex items-center gap-2 text-xl'>
          {onlineUsers.includes(selectedUser._id) && <div className='h-2 w-2 bg-green-500 rounded-2xl'></div>}
          <h1>{selectedUser.fullName}</h1>
        </div>
        <h3 className='text-sm'>{selectedUser.bio}</h3>
      </div>
      <hr className='text-(--text)' />
      <h1 className='my-2'>Media</h1>
      <div className='grid grid-cols-2 overflow-y-scroll gap-y-4 mb-3 h-full'>
        {msgImages.map((image, index) => (
          <img key={index} src={image} className='h-31 w-31' onClick={() => window.open(image)} />
        ))}
      </div>
      <button onClick={()=>logout()} className='bg-(--accent) py-2 px-4 rounded-full w-1/2 mx-auto'>Logout</button>
    </div>
  )
}

export default RightSidebar
