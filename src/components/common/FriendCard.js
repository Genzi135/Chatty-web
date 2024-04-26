import { useEffect, useState } from "react";
import ModalConfirm from "./ModalConfirm";

export default function FriendCard({props}){
    
    const [option, setOption] = useState('');

    const onClose = (id) => {
        id && document.getElementById(id).close();
    }

    useEffect(()=>{
        console.log(option)
        if(option==="cancel"){
            setOption('');
            onClose('modalConfirm')
        }else if(option==="confirm"){
            console.log(option)
        }
    },[option])
    return(
        <div className="p-2 w-auto">
        <div className={`flex justify-between items-center p-4 gap-2 bg-white rounded-lg hover:bg-pink-100`}>
            <div className="flex justify-start items-center gap-3">
            <div className="avatar">
                <div className="avatar w-16 h-16 rounded-full bg-black">
                    <img src={props.avatar} alt="avatar" />
                </div>
            </div>
            <label className="font-semibold text-lg">{props.name&&props.name}</label>
            </div>
            <div className="flex justify-center items-center gap-2">
                <button className="btn btn-secondary text-white">Chat</button>
                <button onClick={()=>document.getElementById("modalConfirm").showModal()} className="btn btn-error text-white">Remove</button>
            </div>
        </div>
        
            <dialog id="modalConfirm" className="modal">
                <ModalConfirm onClose={onClose} setOption={setOption} title={"Wanna remove this friend"} type={'Warning'}/>
            </dialog>
    </div>
    )
}