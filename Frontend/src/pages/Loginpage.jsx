import { useActionState, useContext, useState } from "react"
import assets from "../assets/assets"
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Loginpage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSumitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const submitHandler = (e) => {
    e.preventDefault();

    if (!isLogin && !isSumitted) {
      setIsSubmitted(true);
      return;
    }
    login(isLogin ? "login" : "signin", { fullName, email, password });
    navigate("/");
  }
  return (
    <form className="grid gap-2 md:grid-cols-[2fr_1fr] h-full p-5 md:p-15 items-center" onSubmit={submitHandler}>
      <div className="flex flex-col items-center justify-center h-full">
        <img src={assets.logo} className="h-20 w-20 md:block md:h-40 md:w-50" alt="" />
        <h1 className="text-4xl text-(--accent)">Zap Chat</h1>
      </div>
      <div className="bg-(--border) rounded-lg p-5 flex flex-col gap-2">
        {isLogin ? <h1 className="mb-4 text-xl">Login</h1> : <h1 className="mb-4 text-xl">Sign Up</h1>}
        {!isLogin ? <input type="text" className="bg-(--text) py-2 px-4 my-1 rounded-lg text-black text-sm outline-none" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required /> : ""}
        <input type="email" className="bg-(--text) py-2 px-4 my-1 rounded-lg text-black text-sm outline-none" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" className="bg-(--text) py-2 px-4 my-1 rounded-lg text-black text-sm outline-none" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {
          isLogin ? <button type="submit" className="bg-(--accent) py-2 px-4 rounded-lg my-1 text-black outline-none">Login</button> : <button type="submit" className="bg-(--accent) py-2 px-4 rounded-lg my-1 text-black outline-none">Create Account</button>
        }
        <div className="flex gap-2">
          <input type="checkbox" />
          <p className="text-xs">Agree to the terms of use & privacy policy</p>
        </div>
        {isLogin ?
          <p className="text-sm mt-4">Create an Account? <span onClick={() => { setIsLogin(false) }} className="text-blue-500 cursor-pointer">Click Here</span></p> :
          <p className="text-sm mt-4">Already have an account? <span onClick={() => { setIsLogin(true) }} className="text-blue-500 cursor-pointer">Login here</span></p>
        }
      </div>
    </form>
  )
}

export default Loginpage
