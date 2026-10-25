import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "./AuthContext.jsx";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [allChats, setAllChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});
    const { socket, axios } = useContext(AuthContext);
    const [otherUser, setOtherUser] = useState(null);
    const selectedChatRef = useRef(null);


    //Function to get all users for sidebar
    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/messages/users");
            if (data.success) {
                setUsers(data.users);
                // setUnseenMessages(data.unseenMessages)
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    const getAllChats = async () => {
        try {
            const { data } = await axios.get("/api/messages/chat");
            if (data.success) {
                // console.log("UnseenMessages: ", data.unseenMessages)
                // setUnseenMessages(data.unseenMessages)
                setAllChats(data.chats);
                const unseen = { ...data.unseenMessages };
                if (selectedChatRef.current) {
                    delete unseen[selectedChatRef.current._id]; // open chat is always "seen"
                }
                setUnseenMessages(unseen);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //Function to get messages for selected user
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if (data.success) {
                setMessages(data.messages);
                setUnseenMessages(prev => ({
                    ...prev,
                    [userId]: 0
                }));
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //Function to get last message of selected user to display in sidebar
    const getLastMessage = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/last/${userId}`);
            if (data.success) {
                // console.log(data)
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //Function to send messages to selected user
    const sendMessages = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedChat._id}`, messageData);
            if (data.success) {
                // setMessages((prev) => [...prev, data.newMessage]);
                setMessages((prev) => (prev.some((m) => m._id === data.newMessage._id) ? prev : [...prev, data.newMessage]));
                getAllChats()
            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //Function to subscribe to messages for selected user
    const subscribeToMessages = () => {
        if (!socket) return;
        socket.on("newMessage", async (newMessage) => {
            if (selectedChat?._id === newMessage.chatId) {
                // setMessages((prev) => [...prev, newMessage]);
                setMessages((prev) =>
                    prev.some((m) => m._id === newMessage._id) ? prev : [...prev, newMessage]
                );
                // axios.put(`/api/messages/mark/${newMessage._id}`);
                try {
                    await axios.put(`/api/messages/mark/${newMessage.chatId}`); // ✅ chatId
                } catch (e) { /* ignore */ }
            }
            else {
                setUnseenMessages(prev => ({
                    ...prev,
                    [newMessage.chatId]:
                        (prev[newMessage.chatId] || 0) + 1
                }));
            }
            getAllChats()
        })
    }

    //Function to unsubscribe from messages
    const unSubscribeFromMessages = () => {
        if (socket) {
            socket.off("newMessage");
        }
    }
    // Function to start new Chat
    const startNewChat = async (participant) => {
        try {
            const { data } = await axios.post("/api/messages/newchat", { participant: participant });
            if (data.success) {
                setAllChats((prev) => [...prev, data.chat]);
                setSelectedChat(data.chat);
            }
            else {
                if (data.existingChat) {
                    setSelectedChat(
                        data.existingChat
                    );
                }
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    // Function to create group
    const createGroup = async(name, members, groupImage)=>{
        try {
            const { data } = await axios.post('/api/messages/group', {name, members, groupImage});
            if(data.success){
                setAllChats((prev)=>[data.chat, ...prev]);
                setSelectedChat(data.chat);
                return true;
            }
            toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
        return false;
    }

    useEffect(() => {
        subscribeToMessages();
        return () => unSubscribeFromMessages()
    }, [socket, selectedChat]);

    useEffect(() => {
        selectedChatRef.current = selectedChat;
    }, [selectedChat]);

    const value = {
        messages,
        allChats,
        users,
        getAllChats,
        selectedChat,
        getUsers,
        setMessages,
        sendMessages,
        setSelectedChat,
        unseenMessages,
        setUnseenMessages,
        getMessages,
        getLastMessage,
        startNewChat,
        setOtherUser,
        otherUser,
        createGroup,
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}