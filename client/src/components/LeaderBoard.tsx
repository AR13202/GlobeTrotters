import { userType } from "../types/types";

const LeaderBoard = ({scores,userScore}:{scores:userType[],userScore:userType}) => {
    // console.log("userScore",userScore)
    const sortedScores = [...scores,userScore].sort((a,b)=>b.score-a.score);
    // console.log("sortedScore",sortedScores)
    return (
        <div className='flex flex-col w-full text-[14px] 2xl:text-[18px] fontStyle gap-1'>
            <div className='flex gap-1 border bg-slate-600 text-white px-2 py-1 rounded-sm font-bold'>
                    <div className="w-1/5 text-center">Rank</div>
                    <div className="w-3/5 truncate text-center">UserName</div>
                    <div className="w-1/5 text-center">Score</div>
            </div>
            {sortedScores.map((score,index)=>(
                <div className='flex gap-1 shadow-md border border-gray-100 px-2 py-1 rounded-sm font-medium' key={index+score.username}>
                    <div className="w-1/5 text-center">
                        {index+1}
                    </div>
                    <div className="w-3/5 truncate text-center">{score.username}</div>
                    <div className="w-1/5 text-center">{score.score}</div>
                </div>
            ))}
        </div>
    )
}

export default LeaderBoard;