import logo from '../assets/logo1.png';
import profile from '../assets/Profile.png';
import menu from '../assets/menu-icon.png';
import send from "../assets/send-icon.png"
import image1 from "../assets/image1.webp"
import chatting from "../assets/chatting-image.jpg"
const assets = {
    logo,
    profile,
    menu,
    send,
    image1,
    chatting,
}

export const userInformation = [
    {
    "id": "a1f3c9d2-001",
    "email": "example1@gmail.com",
    "fullName": "Shivam Prakash",
    "profilePicture": profile,
    "bio": "Hi Everyone, Iam using Zap Chat"
},
{
    "id": "b7e4a2f5-002",
    "email": "example2@gmail.com",
    "fullName": "Jhon Doe",
    "profilePicture": profile,
    "bio": "Hi Everyone, Iam using Zap Chat"
},
{
    "id": "c9d8e7f1-003",
    "email": "example3@gmail.com",
    "fullName": "Harry",
    "profilePicture": profile,
    "bio": "Hi Everyone, Iam using Zap Chat"
},
{
    "id": "d6a5b4c3-004",
    "email": "example4@gmail.com",
    "fullName": "Mohan",
    "profilePicture": profile,
    "bio": "Hi Everyone, Iam using Zap Chat"
}
]

export const mediaData = [image1, image1, image1, image1, image1]

export const messageDummyData = [
    {
        "id" : "X9A7B2",
        "senderId": "a1f3c9d2-001",
        "receiverId": "b7e4a2f5-002",
        "text": "hello, my friend. If you want them to be cryptographically strong (for production apps), you’d typically generate them using libraries like crypto in Node.js:",
        "seen": true,
        "createdAt": "2026-03-27T12:47:36.844Z",
    },
    {
        "id" : "Q4L8M5",
        "senderId": "b7e4a2f5-002",
        "receiverId": "a1f3c9d2-001",
        "text": "Hello, how are you",
        "seen": true,
        "createdAt": "2026-03-27T01:30:36.844Z",
    },
    {
        "id" : "T3Z6N1",
        "senderId": "a1f3c9d2-001",
        "receiverId": "b7e4a2f5-002",
        "text": "after so long",
        "seen": true,
        "createdAt": "2026-03-27T01:49:36.844Z",
    },
    {
        "id" : "R8K2J7",
        "senderId": "b7e4a2f5-002",
        "receiverId": "a1f3c9d2-001",
        "text": "hi",
        "seen": true,
        "createdAt": "2026-03-27T01:50:36.844Z",
    },
    {
        "id" : "M5C9H4",
        "senderId": "a1f3c9d2-001",
        "receiverId": "b7e4a2f5-002",
        "text": "hi",
        "seen": true,
        "createdAt": "2026-03-27T02:12:36.844Z",
    },
    {
        "id" : "W2P7D6",
        "senderId": "a1f3c9d2-001",
        "receiverId": "b7e4a2f5-002",
        "text": "hi",
        "seen": true,
        "createdAt": "2026-03-27T02:20:36.844Z",
    },
]
export default assets;