import { create } from "zustand";
import { gameStoreTypes, questionType, userType } from "../types/types";
import { Socket } from "socket.io-client";

const gameStore = create<gameStoreTypes>((set)=>({
    userDetails: {} as userType,
    setUserDetails: (userDetails) => set({userDetails}),

    roomMembers: [] as userType[],
    setRoomMembers: (roomMembers) => set({roomMembers}),

    roomId:"" as string,
    setRoomId: (roomId) => set({roomId}),

    socket: {} as Socket,
    setSocket: (socket) => set({socket}),

    ansPopUp:false,
    setAnsPopUp:(ansPopUp)=>set({ansPopUp}),

    incorrectAnsPopUp:false,
    setInCorrectAnsPopUp:(incorrectAnsPopUp)=>set({incorrectAnsPopUp}),

    question:{} as questionType,
    setQeustion:(question)=>set({question}),
}))

export default gameStore;