import { useNavigate } from "react-router-dom";
import assets from "../assets/assets.js";
import { AuthContext } from "../../context/AuthContext.jsx";
import { ChatContext } from "../../context/ChatContext.jsx";
import { useState, useEffect, useContext } from "react";
import { BiMessageSquareAdd } from "react-icons/bi";
import AllUsers from "./AllUsers.jsx";

const Sidebar = () => {
    const { logout, onlineUsers, authUser, page, setPage } = useContext(AuthContext);
    const { selectedChat, setSelectedChat, users, getUsers, getAllChats, allChats, unseenMessages, setUnseenMessages, getLastMessage, messages, startNewChat, createGroup } = useContext(ChatContext);
    const [input, setInput] = useState("");
    const [debouncedInput, setDebouncedInput] = useState("");
    const [showMenu, setShowMenu] = useState(false);
    const [showUsers, setShowUsers] = useState(allChats ? false : true);
    const nevigate = useNavigate();

    const getStatus = (chat) => {
        const msg = chat.lastMessage;
        if (!msg || msg.senderId !== authUser._id) return null; // only for my own messages

        const others = chat.participant?.filter((p) => p.user._id !== authUser._id) || [];
        const msgTime = new Date(msg.createdAt);

        const seen = others.length > 0 &&
            others.every((p) => p.lastReadAt && new Date(p.lastReadAt) >= msgTime);
        if (seen) return "seen";

        const delivered = others.some((p) => onlineUsers.includes(p.user._id));
        return delivered ? "delivered" : "sent";
    };
    const getChatName = (chat) =>
        chat.isGroup
            ? chat.name
            : chat.participant?.find((p) => p.user._id !== authUser._id)?.user?.fullName;

    const filteredChats = allChats.filter((chat) =>
        getChatName(chat)?.toLowerCase().includes(debouncedInput)
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedInput(input.trim().toLowerCase());
        }, 400);

        return () => clearTimeout(timer); // cancel if the user keeps typing
    }, [input]);

    useEffect(() => {
        getUsers();
        getAllChats();
    }, [onlineUsers])

    useEffect(() => {
        if (allChats.length > 0) {
            allChats.forEach(chat => {
                getLastMessage(chat._id);
            });
        }
    }, [allChats, unseenMessages, messages]);
    return (
        <div className={`${page === "sidebar" ? "flex" : "hidden"} md:flex bg-(--border) rounded-lg py-2 px-4 h-full flex-col gap-7 overflow-scroll relative`}>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img className="h-15 w-20" src={assets.logo} alt="" />
                        <h1 className="text-xl">Zap Chat</h1>
                    </div>
                    <div className="relative py-2 group flex items-center">
                        <i className="p-2 rounded-full hover:bg-(--code-bg) cursor-pointer" onClick={() => { showUsers ? setShowUsers(false) : setShowUsers(true) }}><BiMessageSquareAdd size={25} /></i>
                        <img src={assets.menu} className="h-8 w-8 cursor-pointer hover:bg-(--code-bg) rounded-full" alt="" onClick={() => showMenu ? setShowMenu(false) : setShowMenu(true)} />
                        {showMenu && <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-(--bg) border border-gray-600">
                            <p className="cursor-pointer text-sm" onClick={() => nevigate("/profile")}>Edit Profile</p>
                            <hr className="my-2 border-t border-gray-500" />
                            <p className="cursor-pointer text-sm" onClick={() => logout()}>Logout</p>
                        </div>}
                    </div>
                </div>
                <div className="bg-(--bg) pl-3 pt-2 pb-2 rounded-3xl flex gap-3 items-center">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input onChange={(e) => { setInput(e.target.value) }} type="text" value={input} className="border-none outline-none text-white text-sm placeholder-gray-300" placeholder="search here..." />
                </div>
            </div>
            <div className="flex flex-col gap-2 overflow-y-scroll h-full">
                {filteredChats.length === 0 && debouncedInput && (
                    <p className="text-sm text-center text-gray-400">No chats found</p>
                )}
                {filteredChats.map((chat) => {
                    return (
                        <div key={chat._id} className={`relative flex items-center rounded-xl px-4 py-2 gap-2 cursor-pointer ${selectedChat?.id === chat.id && "bg-(--code-bg)"}`} onClick={() => { setSelectedChat(chat); setUnseenMessages((prev) => ({ ...prev, [chat._id]: 0 })); setPage("chatcontainer") }}>
                            <img src={
                                chat.isGroup ? chat.groupProfilePic || assets.groupicon : chat.participant?.find((p) => p.user._id !== authUser._id).user?.profilePic
                                    || assets.profile} className="h-13 w-13 rounded-full" alt="" />
                            <div>
                                <h1>{
                                    chat.isGroup ? chat.name : chat.participant?.find((p) => p.user._id !== authUser._id).user?.fullName}</h1>
                                <div className="flex gap-2 items-center">
                                    {(() => {
                                        const status = getStatus(chat);
                                        return (
                                            <div className="flex gap-2 items-center">
                                                {status === "seen" && <p className="text-sm text-green-500 shrink-0">seen</p>}
                                                {status === "delivered" && <p className="text-sm shrink-0">sent</p>}
                                                {status === "sent" && <i className="fa-solid fa-check text-sm shrink-0"></i>}
                                                <p className={`text-sm truncate w-35 ${selectedChat ? "md:w-35" : "md:w-50"}`}>
                                                    {chat.lastMessage?.text
                                                        ? chat.lastMessage.text
                                                        : chat.lastMessage?.image
                                                            ? "📷 Image"
                                                            : ""}
                                                </p>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                            {
                                unseenMessages[chat._id] > 0 && <p className="absolute top-7 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">{unseenMessages[chat._id]}</p>
                            }
                        </div>
                    )
                })}
            </div>
            <AllUsers showUsers={showUsers} setShowUsers={setShowUsers} users={users} startNewChat={startNewChat} authUser={authUser} createGroup={createGroup} />
        </div>
    )
}

export default Sidebar
