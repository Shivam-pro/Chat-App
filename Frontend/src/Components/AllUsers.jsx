import React from 'react'
import { CiSearch } from "react-icons/ci";
import { FaArrowLeft } from "react-icons/fa6";
import { TbUsersPlus } from "react-icons/tb";
import { ImagePlus, Loader2 } from "lucide-react";
import assets from "../assets/assets.js";
import { useState, useRef } from 'react';

const AllUsers = ({ showUsers, setShowUsers, users, startNewChat, createGroup, authUser }) => {
  const [groupMode, setGroupMode] = useState(false);
  const [selected, setSelected] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupImage, setGroupImage] = useState(null);
  const [creating, setCreating] = useState(false);
  const fileRef = useRef(null);
  const creatingRef = useRef(false);

  const toggle = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const reset = () => {
    setGroupMode(false);
    setSelected([]);
    setGroupName("");
    setGroupImage(null);
    setCreating(false);
  };
  const close = () => {
    reset();
    setShowUsers(false);
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;           // only images
    if (file.size > 2 * 1024 * 1024) return alert("Image must be under 2MB");

    const reader = new FileReader();
    reader.onloadend = () => setGroupImage(reader.result);
    reader.readAsDataURL(file);
    e.target.value = "";                                    // allows re-picking same file
  };

  const submitGroup = async () => {
    if (creatingRef.current) return;
    creatingRef.current = true;
    setCreating(true);
    try {
      if (await createGroup(groupName, selected, groupImage)) close();
    } finally {
      creatingRef.current = false;
      setCreating(false);
    }
  };

  return (
    <div className={`absolute p-3 top-0 left-0 z-10 h-full w-full bg-(--border)
      transition-transform duration-300 ease-in-out flex flex-col gap-5
      ${showUsers ? "translate-x-0" : "-translate-x-full"}`}>
      <div className='flex gap-5 items-center'>
        <i className='p-2 rounded-full hover:bg-(--code-bg) cursor-pointer' onClick={() => (groupMode ? reset() : close())}>
          <FaArrowLeft size={20} />
        </i>
        <h1>{groupMode ? "New group" : "New Chat"}</h1>
      </div>

      {groupMode ? (
        <div className='flex items-center gap-3'>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImage} />
          <div onClick={() => fileRef.current.click()}
            className='h-14 w-14 shrink-0 rounded-full bg-(--code-bg) overflow-hidden flex items-center justify-center cursor-pointer'>
            {groupImage
              ? <img src={groupImage} alt="group" className='h-full w-full object-cover' />
              : <ImagePlus size={22} />}
          </div>
          <input value={groupName} onChange={(e) => setGroupName(e.target.value)}
            className='px-4 py-2 outline-2 outline-(--accent) rounded-full' placeholder='Group name' />
        </div>
      ) : (
        <>
          <div className='flex px-4 py-2 outline-2 outline-(--accent) rounded-full items-center gap-2'>
            <CiSearch size={20} />
            <input type="text" className='outline-none' placeholder='search name' />
          </div>
          <div onClick={() => setGroupMode(true)}
            className='p-2 flex gap-3 items-center hover:bg-(--code-bg) rounded-lg cursor-pointer'>
            <div className='p-2 rounded-full bg-(--accent) w-fit text-black'><TbUsersPlus size={30} /></div>
            <h1>New group</h1>
          </div>
        </>
      )}

      <div className="flex flex-col gap-2 overflow-y-scroll h-full">
        {users.map((user) => (
          <div key={user._id}
            className={`flex items-center rounded-xl px-4 py-2 gap-2 cursor-pointer ${selected.includes(user._id) ? "bg-(--accent) text-black" : "bg-(--code-bg)"}`}
            onClick={() => {
              if (groupMode) return toggle(user._id);
              startNewChat([user._id, authUser._id]);
              close();
            }}>
            <img src={user.profilePic || assets.profile} className="h-13 w-13 rounded-full" alt="" />
            <h1>{user.fullName}</h1>
          </div>
        ))}
      </div>

      {groupMode && (
        <button disabled={!groupName.trim() || selected.length < 2 || creating} onClick={submitGroup}
          className='bg-(--accent) text-black py-2 rounded-full disabled:opacity-40'>
          {creating ? (
            <div className='flex justify-center items-center gap-2 text-white'>
              <Loader2 size={18} className='animate-spin' />
              Creating...
            </div>
          ) : (
            `Create group (${selected.length})`
          )}
        </button>
      )}
    </div>
  )
}

export default AllUsers;