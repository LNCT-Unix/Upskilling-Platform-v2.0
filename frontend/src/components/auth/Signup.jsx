// we are going to take name , email and password as input form the user and then we are going to 
//send it to the backend and then also what the backend team will do is return us a success message with a 
// user.id and user.email and user.name with status code also

import {useState} from "react";
import {useNavigate, Link} from "react-router-dom"
function Signup() {
  const navigate=useNavigate();

  const [name , setName]=useState("");
  const [email, setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);
  const [success,setSuccess]=useState(false);

 async function handleSignup(e){
  e.preventDefault();
  setError("");
  setLoading(true);

  try{
    const res=await fetch("apan ko yaha pe apna signup route dalna hai",{
      method :"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({name , email ,password}),
    });

    const data =await res.json();
    if(!res.ok){
      setError(data.message || "signup failedddd")
      return ;
    }

    setSuccess(true);
  } catch(e){
     setError("something went wrong. please try agian ")
  } finally {
    setLoading(false);
  }
 }
  return (
     <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white text-black p-8 rounded-xl border border-gray-200">

        {success ?(
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-3">signup successful</h1>
            <p className="text-sm text-gray-500 mb-6">your accoutn has been successfully created </p>
            <button
              onClick={()=>navigate("/login")}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md text-sm font-medium transition-colors"
            >
              go to login
            </button>
          </div>
        ):(
          <form
          onSubmit={handleSignup}
          >
            <h1 className="text-2xl font-semibold tracking-tight">create account</h1>
            <p className="text-sm text-gray-500 mt-2 mb-6">Enter your details to get started.</p>

            <input
            type="text"
            placeholder="full name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
            className="w-full px-3 py-3 mb-4 border border-gray-200 rounded-md text-sm outline-none focus:border-purple-500 transition-colors"
            />

            <input
            type="email"
            placeholder="enter email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
            className="w-full px-3 py-3 mb-4 border border-gray-200 rounded-md text-sm outline-none focus:border-purple-500 transition-colors"
            />


            <input
            type="password"
            placeholder="enter password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
            className="w-full px-3 py-3 mb-4 border border-gray-200 rounded-md text-sm outline-none focus:border-purple-500 transition-colors"
            />

            {error && (
              <p className="text-sm text-red-500 mb-4">{error}</p>
            )}

            <button 
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-3 rounded-md text-sm font-medium transition-colors"

            >
              {loading?"creating account...":"signup"}
            </button>

            <p className="text-sm text-gray-500 text-center mt-6">
              Already have an account?{" "}
              <Link to ="/login"
              className="text-purple-600 hover:text-purple-700 underline">Login</Link>
            </p>

          </form>
        )}
      </div>
     </div>
  )
}

export default Signup