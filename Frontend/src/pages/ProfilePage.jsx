import { useContext, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);
  const submitHandler = async(e) => {
    e.preventDefault();
    if(!selectedImg){
      await updateProfile({fullName: name, bio});
      navigate('/');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async()=>{
      const base64Image = reader.result;
      await updateProfile({profilePic: base64Image, fullName: name, bio});
      navigate("/");
    }
  }
  return (
    <div className="flex flex-col md:flex-row gap-10 px-10 py-5 md:px-20 h-full w-full items-center">
      <div className="flex items-center justify-center w-full">
        <img src={authUser.profilePic || assets.chatting} className="h-30 w-30 md:h-40 md:w-40 rounded-full" alt="" />
      </div>
      <form onSubmit={submitHandler} className="flex flex-col gap-2 w-full md:w-[50%] bg-(--border) rounded-lg p-5 h-fit">
        <h1>Profile Details</h1>
        <input type="file" id="profile-image" accept='image/png, image/jpeg' onChange={(e)=>setSelectedImg(e.target.files[0])}/>
        <label htmlFor="profile-image" className="flex items-center gap-3 cursor-pointer">
          <img src={selectedImg ? URL.createObjectURL(selectedImg) : authUser.profilePic || assets.profile} className="h-15 w-15 rounded-full" alt="" />
          <p>Upload Profile image</p>
        </label>
        <div className="flex items-center gap-3">
        </div>
        <input type="text" className="bg-(--text) py-2 px-4 my-1 rounded-lg text-black text-sm outline-none" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required/>
        <textarea type="text" className="bg-(--text) min-h-20 py-2 px-4 my-1 rounded-lg text-black text-sm outline-none" placeholder="Enter your Bio" value={bio} onChange={(e) => setBio(e.target.value)} required/>
        <button className="bg-(--accent) py-2 px-4 rounded-full my-1 text-black outline-none">Save</button>
      </form>
    </div>
  )
}

export default ProfilePage;