function getUniqueRoomId(rooms){
    let roomId;
    do {
      roomId = Math.random().toString(36).substring(2, 10); // Generates an 8-character random string
    } while (rooms.includes(roomId)); // Ensure uniqueness
    return roomId;
}

module.exports = { getUniqueRoomId };