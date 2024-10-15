import { Server, Socket } from "socket.io";

function gameHandler(io:Server, socket: Socket) {
    const sendNoteList = (data: any) => {
        socket.broadcast.emit('receive_noteslist', data.noteList);
        console.log('Notelist sent');
    }

    socket.on("send_noteslist",sendNoteList);
    
    return () =>{
        socket.off("send_noteslist",sendNoteList);
    }
}
export default gameHandler;