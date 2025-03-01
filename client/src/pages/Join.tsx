import { useNavigate, useSearchParams } from "react-router-dom";
import gameStore from "../store/gameStore";
import { useCallback, useEffect, useState } from "react";
import { userType } from "../types/types";

const Join = () => {
    const [params] = useSearchParams();
    const room = params.get('id');
    const store = gameStore();
    const navigate = useNavigate();
    const [users,setUsers] = useState<string[]>([]);
    const updateRoomMembers = useCallback((data:userType[],socketId:string)=>{
            console.log("got room members",data,socketId);
            if(socketId==store.socket.id){
                store.setRoomMembers(data);
            }
        },[store])
    useEffect(()=>{
        const socket = store.socket;
        if(socket && socket.id){
            socket.on("room-validated", (data) => {
                if(data.res=="failed"){
                    alert("Room not found, please check roomId");
                    navigate('/');
                }else{
                    if(room){
                         store.setRoomId(room);
                         console.log("users",data.users);
                         setUsers(data.users);
                    }
                }
            });
            store.socket.on("room-members",updateRoomMembers);
            
            return (()=>{
                store.socket.off("room-members",updateRoomMembers);
                socket.off("room-validated",(data) => {
                    if(data.res=="failed"){
                        alert("Room not found, please check roomId");
                        navigate('/');
                    }else{
                        if(room){
                             store.setRoomId(room);
                             setUsers(data.users);
                        }                   
                    }
                });
            })
        }
    },[navigate, room, store, store.socket, updateRoomMembers])
    if(!params.get('id')){
        return <div>incorrect URL missing room ID</div>
    }else if(params.get('id')){
        const socket = store.socket;
        if(socket && socket.id){ 
            socket.emit("validate-roomId",params.get('id'));
        }
    }    
    const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const temp: string = (form.elements.namedItem("username") as HTMLInputElement).value;
        if(users.includes(temp)){
            alert("Username already taken");
            return;
        }
        const user = store.userDetails;
        user.username = temp;
        user.score = 0;
        user.socketId = store.socket.id || "";
        console.log(user.username)
        store.setUserDetails(user);
        (form.elements.namedItem("username") as HTMLInputElement).value = "";
        console.log("Form Submitted");
        const socket = store.socket;
        if(socket){
            console.log("joiningroom....");
            socket.emit("getRoomMembers",room,user.username)
            socket.emit("join-room",room,user.username,socket.id);
            navigate(`/quiz?id=${room}`);
        }
      };
  return (
    <div className="flex w-screen h-screen items-center justify-center gap-10 mainBackground">
      <div className="flex justify-center items-center flex-col gap-5 bg-slate-100 p-10 opacity-95 rounded-xl">
        <h1 className="text-[35px] font-extrabold fontStyle">GlobeTrotters</h1>
        <form onSubmit={(e)=>formSubmit(e)} className="flex  flex-col justify-center items-center gap-2">
            <input className="w-full lg:px-4 px-2 py-2 border border-gray-300 bg-white rounded-md" placeholder="enter your username..." name="username"/>
            <button className="bg-blue-500 hover:bg-blue-700 text-white w-full font-bold py-2 px-4 rounded">
              Join Quiz
            </button>
        </form>
      </div>
    </div>
  )
}

export default Join