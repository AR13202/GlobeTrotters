import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import gameStore from './store/gameStore';
import Join from './pages/Join';
function App() {
  const store = gameStore();
  console.log(import.meta.env.VITE_SERVER_URL)
  useEffect(() => {
    const isLocalhost = window.location.hostname === 'localhost';
    const socket = io(isLocalhost?'http://localhost:4000':import.meta.env.VITE_SERVER_URL);
    console.log("socket Connected --> ",socket);
    store.setSocket(socket)
    if(socket && socket.id){
      const userDetails = {
        username: "",
        score: 0,
        socketId: socket.id,
      }
      store.setUserDetails(userDetails);
    }

    return (()=>{
      socket.disconnect();
      console.log("<---Socket Disconnected--->");
    });
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/join" element={<Join />} />
      </Routes>
    </Router>
  )
}

export default App
