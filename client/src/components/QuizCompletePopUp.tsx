import gameStore from '../store/gameStore'
import { useNavigate } from 'react-router-dom';

const QuizCompletePopUp = () => {
    const store = gameStore();
    const navigate = useNavigate();
    const buttonClick = () => {
        store.socket.emit('user-disconnected',store.socket.id,store.roomId,store.userDetails.username);
        store.socket.disconnect();
        navigate('/');
        window.location.reload();
    }
  return (
    <div className='flex flex-col'>
        Seam Like you have completed the quiz
        here is your final score {store.userDetails.score}
        <button onClick={()=>buttonClick()}>Go to Home Page {"->"}</button>
    </div>
  )
}

export default QuizCompletePopUp;