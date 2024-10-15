import { useEffect, useState } from "react";
import socket from "../socket";
import Countdown from '../Countdown';

function Piano() {
    const notes = ['C','D','E','F','G','A','B'];
    const [noteList , setNoteList] = useState<{id: number; note: string}[]>([]);
    const [noteList_Received , setNoteList_Received] = useState<{id: number; note: string}[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    // const [isCreating, setIsCreating] = useState(false);

    const handleClickKeys = (item: string) => {
        if (noteList.length < 5) {
                setNoteList((prevNoteList) => {
                const newNote = {id: noteList.length, note: item};
                const  newNoteList = [...prevNoteList, newNote];
                console.log(newNote)
                return newNoteList;
            });
        }
            
    }

    const handleSubmit = () => {
        socket.emit("send_noteslist", {noteList: noteList});
        setIsRunning(false)
        setNoteList([])
    }

    const handleReset = () => {
        setNoteList([]);
    }

    const handleCreate = () => {
        setIsRunning(true)
        // setIsCreating(true);
    }

    useEffect(() => {
        const receiveNotes = (data: { id: number; note: string }[]) => {
            setNoteList_Received(data);
            console.log("Received notes:", data);
        };

        socket.on("receive_noteslist", receiveNotes);

        return () => {
            socket.off("receive_noteslist", receiveNotes);
        };
    },[noteList_Received])

    useEffect(() => {
        console.log(noteList)
    },[noteList])

    return (
        <>
        <div>
            <button onClick={handleCreate}>Ready!!</button>
            <p></p>
        </div>
        <div>
            <div>Countdown</div>
            <Countdown 
            key={`countdown`} 
            duration={10} 
            isRunning={isRunning} 
            onTimeout={handleSubmit} />
        </div>
            <div className="piano-keys">
                {notes.map((item) => (
                    <button 
                    key={item} 
                    onClick={() => {handleClickKeys(item)}}
                    >
                        {item}
                    </button>
                ))}
                <p></p>
                <button onClick={handleSubmit}>Submit</button>
                <button onClick={handleReset}>Reset</button>
            </div>

            <div className="display">
                <div>Received Notes</div>
                {noteList_Received.map((item) => (
                    <div className="display-notes" key={item.id}>
                        {item.note}
                    </div>
                ))}
            </div>

            <div className="display">
                <div>Send Notes</div>
                {noteList.map((item) => (
                    <div className="display-notes" key={item.id}>
                        {item.note}
                    </div>
                ))}
            </div>
        </>
    )
}

export default Piano;