import gameStore from "../store/gameStore";
import { getRandomItem } from "../utils/getRandomItem";

const IncorrectAnsPopUp = ({funFact, correctAns}:{funFact:string,correctAns:string}) => {
    const store = gameStore();
    const getNextQuestion = () => {
        store.socket.emit('get-question',store.socket.id,store.roomId,store.userDetails.username);
        store.setInCorrectAnsPopUp(false);
    }
    const imagesArr = ['/incorrect/1.gif','/incorrect/2.gif','/incorrect/3.gif','/incorrect/4.gif'];

  return (
    <div className="flex h-full w-full justify-center items-center">
    <div className=" p-3 rounded-xl w-3/4 flex flex-col lg:flex-row fontStyle bg-slate-800 text-white items-center gap-2">
      <div className="lg:w-1/2 flex flex-col items-center rounded-xl">
        <img src={getRandomItem(imagesArr)} className="w-full aspect-4/3 p-3 "/>
        <div>Correct Answer is </div>
        <h1 className="text-[40px] font-extrabold text-center">{correctAns}</h1>
        <div className="text-red-700 font-bold">Your answer is correct</div>
      </div>
      <div className="lg:w-1/2 flex flex-col gap-10 2xl:text-xl">
        <div className="flex flex-col gap-4 items-center">
          <div>Here's a fun fact about this place</div>
        <hr className="bg-black border w-full"/>
          <div className="px-2 text-center">{funFact}</div>
        </div>
        <button onClick={()=>getNextQuestion()} className="bg-white text-black w-4/5 mx-auto rounded-md p-2 font-bold hover:underline">Next Question</button>
      </div>
    </div>
  </div>
  )
}

export default IncorrectAnsPopUp