import { useEffect, useState } from "react";
import ModalConfirm from "./ModalConfirm";
import { handleOpenConversation, handleRemoveFriend } from "../shared/api";
import { useDispatch, useSelector } from "react-redux";

export default function FriendCard({ props, optionButton, isRefresh }) {
    const reduxListConversation = useSelector((state) => state.listConversation);
    const [option, setOption] = useState('');
    const dispatch = useDispatch()

    const onClose = (id) => {
        id && document.getElementById(id).close();
    }

    useEffect(() => {
        if (option === "cancel") {
            setOption('');
            onClose('modalConfirm')
        } else if (option === "confirm") {
            handleRemoveFriend(props._id)
            isRefresh(true)
            setOption('');
            onClose('modalConfirm')
        }
    }, [option])

    return (
        <div className="p-2 w-auto">
            <div className={`flex justify-between items-center p-4 gap-2 bg-white rounded-lg hover:bg-pink-100`}>
                <div className="flex justify-start items-center gap-3">
                    <div className="avatar">
                        <div className="avatar w-12 h-12 rounded-full bg-black">
                            <img src={props.avatar} alt="avatar" />
                        </div>
                    </div>
                    <label className="font-semibold text-lg">{props.name && props.name}</label>
                </div>
                {optionButton && optionButton === 'ChatRemove' && <div className="flex justify-center items-center gap-2">
                    <button className="btn btn-secondary text-white" onClick={() => { handleOpenConversation(props.userId, dispatch, reduxListConversation) }}>Chat</button>
                    <button onClick={() => document.getElementById("modalConfirm").showModal()} className="btn btn-error text-white">Remove</button>
                </div>}
                {optionButton && optionButton === 'Selected' && "Selected"}
                {!optionButton && <div></div>}
            </div>

            <dialog id="modalConfirm" className="modal">
                <ModalConfirm onClose={onClose} setOption={setOption} title={"Wanna remove this friend"} type={'Warning'} />
            </dialog>
        </div>
    )
}