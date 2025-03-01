import { Socket } from "socket.io-client"

export type userType = {
    username:string,
    score:number,
    socketId:string,
}

export type questionType = {
    city:string,
    trivia:string[],
    clues:string[],
    options:string[],
    funFact:string[],
}

export type gameStoreTypes = {
    userDetails: userType,
    setUserDetails: (userDetails:userType) => void,
    roomMembers: userType[],
    setRoomMembers: (roomMembers:userType[]) => void,
    roomId:string,
    setRoomId: (roomId:string) => void,
    socket:Socket,
    setSocket: (socket:Socket) => void,
    ansPopUp:boolean,
    setAnsPopUp:(res:boolean) =>void,
    incorrectAnsPopUp:boolean,
    setInCorrectAnsPopUp:(res:boolean) =>void,
    question:questionType,
    setQeustion:(ques:questionType) => void
}