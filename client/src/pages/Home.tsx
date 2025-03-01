import { useEffect } from "react";
import gameStore from "../store/gameStore";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const store = gameStore();

  useEffect(()=>{
    const socket = store.socket;
    if(socket && socket.id){
      socket.on("room-created", (roomId) => {
      // console.log("room-created",roomId);
      navigate(`/quiz?id=${roomId}`);
      store.setRoomId(roomId);
    });
    return (()=>{
      socket.off("room-created",(roomId) => {
        // console.log("room-created",roomId);
        navigate(`/quiz?id=${roomId}`);
        store.setRoomId(roomId);
      });
    })
  }
  },[navigate, store, store.socket])

  const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = store.userDetails;
    const form = e.target as HTMLFormElement;
    const temp: string = (form.elements.namedItem("username") as HTMLInputElement).value;
    user.username = temp;
    user.score = 0;
    user.socketId = store.socket.id || "";
    // console.log(user)
    store.setUserDetails(user);
    (form.elements.namedItem("username") as HTMLInputElement).value = "";
    // console.log("Form Submitted");
    store.socket.emit("create-room",user.username);
  };
  return (
    <div className="flex w-screen h-screen items-center justify-center gap-10 mainBackground relative">
      <div className="flex justify-center items-center flex-col gap-5 bg-slate-100 p-10 opacity-95 rounded-xl">
        <h1 className="text-[35px] font-extrabold fontStyle">GlobeTrotters</h1>
        <form onSubmit={(e)=>formSubmit(e)} className="flex  flex-col justify-center items-center gap-2">
            <input className="w-full lg:px-4 px-2 py-2 border border-gray-300 bg-white rounded-md" placeholder="enter your username..." name="username"/>
            <button className="bg-blue-500 hover:bg-blue-700 text-white w-full font-bold py-2 px-4 rounded">
              Start Quiz
            </button>
        </form>
      </div>
      <div className={`${store.socket.id ? 'bg-green-300 text-green-800':'bg-red-300 text-red-800'} opacity-80 absolute bottom-2 right-2 z-3 px-3 py-1 rounded-md `}>{store.socket.id? 'server started...':'server starting, refresh in a minute...'}</div>
    </div>
  )
}

export default Home;