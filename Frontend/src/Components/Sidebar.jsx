import { useNavigate } from "react-router-dom"
import assets from "../assets/assets.js"
import { AuthContext } from "../../context/AuthContext.jsx";
import { ChatContext } from "../../context/ChatContext.jsx";
import { useState, useEffect, useContext } from "react";

const Sidebar = () => {
    const { logout, onlineUsers, socket, authUser, page, setPage } = useContext(AuthContext);
    const { selectedUser, setSelectedUser, getUsers, users, unseenMessages, setUnseenMessages, lastMessage, setLastMessage, getLastMessage, messages } = useContext(ChatContext);
    const [input, setInput] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const nevigate = useNavigate();

    const filteredUser = input ? users.filter((user) => user.fullName.toLowerCase().includes(input.toLowerCase())) : users;

    useEffect(() => {
        getUsers()
    }, [onlineUsers])

    useEffect(() => {
        if (users.length > 0) {
            users.forEach(user => {
                getLastMessage(user._id);
            });
        }
    }, [users, unseenMessages ,messages]);

    return (
        <div className={`${page === "sidebar" ? "flex" : "hidden"} md:flex bg-(--border) rounded-lg py-2 px-4 h-full flex-col gap-7 overflow-scroll`}>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img className="h-15 w-20" src={assets.logo} alt="" />
                        <h1 className="text-xl">Zap Chat</h1>
                    </div>
                    <div className="relative py-2 group">
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
                    <input onChange={(e) => setInput(e.target.value)} type="text" className="border-none outline-none text-white text-sm placeholder-gray-300" placeholder="search here..." />
                </div>
            </div>
            <div className="flex flex-col gap-2 overflow-y-scroll h-full">
                {filteredUser.map((user, index) => {
                    return (
                        <div key={user._id} className={`relative flex items-center rounded-xl px-4 py-2 gap-2 cursor-pointer ${selectedUser?.id === user.id && "bg-(--code-bg)"}`} onClick={() => { setSelectedUser(user); setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 })); setPage("chatcontainer") }}>
                            <img src={user.profilePic || assets.profile} className="h-13 w-13 rounded-full" alt="" />
                            <div>
                                <h1>{user.fullName}</h1>
                                <div className="flex gap-2 items-center">
                                    {
                                        (lastMessage[user._id] && lastMessage[user._id]?.senderId === authUser._id) && (lastMessage[user._id]?.seen ? <p className="text-green-500">seen</p> :
                                            onlineUsers.includes(user._id) ?
                                                <i className="fa-solid fa-check text-sm text-green-500"></i> :
                                                <i className="fa-solid fa-check text-sm"></i>)
                                    }
                                    <p className={`text-sm truncate w-35 ${selectedUser ? " md:w-35" : " md:w-50"}`}>{lastMessage[user._id]?.text
                                        ? lastMessage[user._id].text
                                        : lastMessage[user._id]?.image
                                            ? "📷 Image"
                                            : ""}</p>
                                </div>
                            </div>
                            {
                                unseenMessages[user._id] > 0 && <p className="absolute top-7 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">{unseenMessages[user._id]}</p>
                            }
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Sidebar
