import {useState} from "react"
import {useNavigate,Link} from "react-router-dom";




function Login() {
const navigate=useNavigate();

const [email,setEmail]=useState("");
const [password,setPassword]=useState("");
const [error,setError]=useState("");
const [loading,setLoading]=useState(false);
const [success, setSuccess] = useState(false);
async function handleLogin(e){
       e.preventDefault();
       setError("");
       setLoading(true);

       try{
        //api calling
        const res=await fetch("https://strings-commitments-ampland-white.trycloudflare.com/api/auth/login ", {
          method :"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({email,password})

        });
        const data=await res.json();
        if(!res.ok){
          setError(data.message || "login failed")
          return ;
        }
        setSuccess(true);

       } catch(e){
        setError("something went wrong")
        console.log(e);
       } finally{
        setLoading(false);
       }
}
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white text-black p-8 rounded-xl border border-gray-200">
        {success?(
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-3">Login successful</h1>
            <p className="text-sm text-gray-500 mb-6">welcome back </p>
            <button
            onClick={()=>navigate("/logout")}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md text-sm font-medium transition-colors"
            >
go to logout
            </button>
            </div>
        ):(
          <form
          onSubmit={handleLogin}
          >
           <h1 className="text-2xl font-semibold tracking-tight">
            Login
           </h1>

           <p className="text-sm text-gray-500 mt-2 mb-6">
            Welcome back! Enter your details.
           </p>

           <input
           type="email"
           placeholder="email"
           value={email}
           onChange={(e)=>
            setEmail(e.target.value)
           }
            required
           className="w-full px-3 py-3 mb-4 border border-gray-200 rounded-md text-sm outline-none focus:border-purple-500 transition-colors"
           />


           <input
           type="password"
           placeholder="password"
           value={password}
           onChange={(e)=>
            setPassword(e.target.value)
           }
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
{loading ?"logging in...":
"login"
}
       </button>

       <p className="text-sm text-gray-500 text-center mt-6">
        dont have an account ?{" "}
        <Link to ="/signup"
        className="text-purple-600 hover:text-purple-700 underline"
        >
        signup</Link>
       </p>
         
          </form>
        )}
      </div>
    </div>
  )
}

export default Login