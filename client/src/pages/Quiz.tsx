import { useCallback, useEffect, useState } from "react";
import Flashcard from "../components/Flashcard"
import LeaderBoard from "../components/LeaderBoard";
import { useNavigate, useSearchParams } from "react-router-dom";
import gameStore from "../store/gameStore";
import QRCode from 'qrcode';
import QRCodePopUp from "../components/QRCodePopUp";
import { questionType, userType } from "../types/types";
import CorrectAnsPopUp from "../components/CorrectAnsPopUp";
import IncorrectAnsPopUp from "../components/IncorrectAnsPopUp";
const Quiz = () => {
    const [params] = useSearchParams();
    const store = gameStore();
    const [showLeaderboard, setShowLeaderboard] = useState(true);
    const [showSharePopup,setShowSharePopup] = useState(false);
    const [qrCode,setQRcode] = useState("");
    const [startQuiz,setStartQuiz] = useState(false);
    const [quizCompleted,setQuizCompleted] = useState(false);

    const windowUrl = window.location.href;
    const url = windowUrl.split("quiz");    
    const newURL = url[0] + 'join' + url[1];
    const navigate = useNavigate();
    const quitGame = () => {
        store.socket.emit('user-disconnected',store.socket.id,store.roomId,store.userDetails.username);
        store.socket.disconnect();
        navigate('/');
        window.location.reload();
    }

    const handleGetQuestion = useCallback((data:{
        city:string,country:string,clues:string[],options:string[],
        fun_fact:string[],trivia:string[],res:string,questionIndex:number
    }) => {
        if(data.res=="completed"){
            setQuizCompleted(true);
            setShowLeaderboard(true);
            store.setQeustion({} as questionType);
            return;
        }
        const question:questionType ={
            city:data.city,
            clues:data.clues,
            funFact:data.fun_fact,
            trivia:data.trivia, 
            options:data.options
        } 

        store.setQeustion(question);
    },[store])

    useEffect(()=>{
        // const roomId = params.get("id");
        // console.log("roomId",roomId);
        QRCode.toDataURL(newURL)
        .then((url:string) => {
            setQRcode(url);
        })
        .catch((err:Error) => {
            console.error(err)
        })   
    },[newURL, params])

    const handleStartQuiz = () => {
        setStartQuiz(true);
        store.socket.emit('get-question',store.socket.id,store.roomId,store.userDetails.username)
    }

    const addNewMember = useCallback((data:{username:string,score:number,socketId:string,res:string}) => {
        // console.log("new user joined",data);
        const temp = store.roomMembers;
        temp.push({
            username:data.username,
            score:data.score,
            socketId:data.socketId
        });
        store.socket.emit('send-detail-to-new-user',{username:store.userDetails.username,score:store.userDetails.score,socketId:store.socket.id,roomId:store.roomId})
        store.setRoomMembers(temp);
    },[store])

    const checkAns = (data:string) => {
        if(data==store.question.city){
            store.setAnsPopUp(true);
            const user = store.userDetails;
            user.score+=1;
            store.setUserDetails(user);
            store.socket.emit('update-score',store.socket.id)
        }else{
            store.setInCorrectAnsPopUp(true);
        }
    }

    const updateRoomMemberScore = useCallback((data: {
        score:number,username:string,socketId:string,res:string
    }) => {
        const roomMembers = store.roomMembers;
        roomMembers.map((mem)=>{
            if(mem.socketId==data.socketId){
                mem.score+=1;
            }
        })
        store.setRoomMembers(roomMembers);
    },[store])

    const detailForNewUser = useCallback((data:userType)=>{
        const members = store.roomMembers;
        if(!members.find(mem=>mem.socketId==data.socketId)){
            members.push(data);
            store.setRoomMembers(members);
        }
    },[store])

    useEffect(()=>{
        store.socket.on("user-joined-broadcast",addNewMember);
        store.socket.on('question',handleGetQuestion);
        store.socket.on('update-score-broadcast',updateRoomMemberScore)
        store.socket.on('details-for-new-user',detailForNewUser);
        return(()=>{
            store.socket.off('details-for-new-user',detailForNewUser);
            store.socket.off('update-score-broadcast',updateRoomMemberScore)
            store.socket.off('question',handleGetQuestion);
            store.socket.off("user-joined-broadcast",addNewMember);
        })
    },[addNewMember, handleGetQuestion, updateRoomMemberScore, store.socket, detailForNewUser])

    // console.log("store.userDetails",store.userDetails)
  return (
    <div className="flex flex-col lg:flex-row w-screen h-screen items-center justify-center bg-[#0a092d] relative">
        <div className={`relative z-11 flex flex-col gap-10 bg-white  ${!showLeaderboard ? 'lg:w-0 h-0': 'lg:w-1/4 lg:px-2 h-full w-full z-10'} transition-all duration-500 lg:h-full py-2 2xl:py-4`}>
            <div className={`hover:underline cursor-pointer hidden lg:flex border-b border-gray-400 items-center fontStyle gap-1 ${!showLeaderboard && 'hidden' }`} onClick={()=>!quizCompleted && setShowLeaderboard(false)}> 
                {!quizCompleted ? <>
                <img src="/rightArrowBlack.png" className="w-7 h-7 lg:rotate-180 -rotate-90"/>
                <div className="text-[14px] 2xl:text-xl">Hide leaderboard</div>
               </>
               :
               <div className="mx-auto">You have completed the quiz</div>
               }
            </div>
            {showLeaderboard && 
                <>
                    <div className="h-full flex justify-center w-full">
                        <LeaderBoard scores={store.roomMembers} userScore={{...store.userDetails}}/>
                    </div>
                    <div className={`hover:underline cursor-pointer flex lg:hidden mx-auto items-center fontStyle gap-1 ${!showLeaderboard && 'hidden' }`} onClick={()=>!quizCompleted && setShowLeaderboard(false)}> 
                    {!quizCompleted ? 
                        <>
                            <img src="/rightArrowBlack.png" className="w-7 h-7 lg:rotate-180 -rotate-90"/>
                            <div className="text-[14px] 2xl:text-xl">Hide leaderboard</div>
                        </>
                        :<div className="mx-auto">You have completed the quiz</div>
                    }
                    </div>
                    {!quizCompleted ? 
                        <div className="flex justify-center fontStyle text-[14px] 2xl:text-xl">
                            <button className="border p-3 rounded-md bg-blue-800 text-white" onClick={()=>setShowSharePopup(true)}>Play with your friends</button>
                        </div>
                        :<div className="flex justify-center fontStyle text-[14px] 2xl:text-xl">
                            <button className="border p-3 rounded-md bg-blue-800 text-white" onClick={()=>quitGame()}>Finish</button>
                        </div>
                    }
                </>
            }
        </div>
        {!quizCompleted && <div className={`flex flex-col ${!showLeaderboard ? 'h-full':'h-0'} w-full duration-500 lg:w-3/4 lg:h-full relative`}>
            <div className="w-full h-full flex flex-col text-white border-gray-200 relative z-1"> 
                <div className="flex justify-between w-full h-fit p-2 text-[14px] 2xl:text-xl 2xl:pt-4">
                    <div className={`hover:underline flex items-center cursor-pointer fontStyle ${showLeaderboard && 'hidden' }`} onClick={()=>setShowLeaderboard(true)}>
                        <div className="">Show LeaderBoard</div> 
                        <img src="/rightArrow.png" className="w-7 h-7 lg:rotate-0 rotate-90"/>
                    </div>
                    <div className="font-medium fontStyle">
                        Your Score: {store.userDetails.score}
                    </div>
                </div>
                {(store.question.city && !store.ansPopUp && !store.incorrectAnsPopUp) &&
                    <>
                        <div className="w-full h-2/3 p-2 px-10 2xl:pt-20">
                            <Flashcard frontText={store.question.clues[0]} backText={store.question.clues[1]}/>
                        </div>
                        <div className="flex p-1 text-[20px] 2xl:text-2xl justify-center font-bold items-center fontStyle 2xl:py-4">
                            Guess the place?
                        </div>
                        <div className="w-full grid grid-cols-2 h-1/3 gap-10 py-3 px-10 2xl:py-5">
                            {store.question.options.map((option)=>(
                                <div key={option} className="flex justify-center items-center 2xl:text-2xl fontStyle hover:bg-blue-700 hover:text-white bg-white shadow-lg text-black rounded-2xl" onClick={()=>checkAns(option)}>{option}</div>
                            ))}
                        </div>
                    </>
                }
                {store.ansPopUp && <CorrectAnsPopUp correctAns={store.question.city} funFact={store.question.funFact[0]}/>}
                {store.incorrectAnsPopUp && <IncorrectAnsPopUp correctAns={store.question.city} funFact={store.question.funFact[0]}/>}
                {!startQuiz && <div className="w-full h-full flex justify-center items-center">
                    <button className={`bg-blue-500 rounded-md p-3 ${showLeaderboard && 'hidden lg:block'}`} onClick={()=>handleStartQuiz()}>Start Quiz</button>
                </div>}
            </div>
        </div>}
        {showSharePopup && <QRCodePopUp newURL={newURL} qrCode={qrCode} setShowSharePopup={setShowSharePopup}/>}
    </div>
  )
}

export default Quiz