import { useContext, useState } from "react"
import ChatContainer from "../Components/ChatContainer"
import RightSidebar from "../Components/RightSidebar"
import Sidebar from "../Components/Sidebar"
import { ChatContext } from "../../context/ChatContext"

const HomePage = () => {
  const { selectedChat } = useContext(ChatContext);
  return (
    <div className={`bg-(--code-bg) text-white p-3 rounded-lg h-full`}>
      <div className={`h-full grid grid-cols-1 relative ${selectedChat ? 'md:grid-cols-[0.8fr_1.5fr_0.8fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-[1fr_2fr]'} gap-2`}>
      <Sidebar/>
      <ChatContainer />
      {selectedChat ? <RightSidebar /> : ""}
      </div>
    </div>
  )
}

export default HomePage
