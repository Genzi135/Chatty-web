import { useEffect, useState } from "react";
import ModalConfirm from "./ModalConfirm";
import { handleGetFriendList, handleOpenConversation, handleRemoveFriend } from "../shared/api";
import { useDispatch, useSelector } from "react-redux";
import HeaderModal from "./HeaderModal";

export default function FriendCard({ props, optionButton, isRefresh, dataSource }) {
    const reduxListConversation = useSelector((state) => state.listConversation);
    const [option, setOption] = useState('');
    const dispatch = useDispatch()

    console.log(props._id)

    const onClose = (id) => {
        id && document.getElementById(id).close();
    }

    const removeFriend = (friendId) => {
        handleRemoveFriend(friendId)
            .then(() => {
                handleGetFriendList()
                    .then((response) => dataSource(response.data.data))
                })
        isRefresh(true)
        setOption('')
        onClose('modalConfirm')
    }

    const openModal = (friendId) => {
        document.getElementById("modalConfirm").showModal()
        document.getElementById("confirmButton").addEventListener("click", () => removeFriend(friendId))
    }

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
                    <button onClick={() => {openModal(props._id)}} className="btn btn-error text-white">Remove</button>
                </div>}
                {optionButton && optionButton === 'Selected' && "Selected"}
                {!optionButton && <div></div>}
            </div>

            <dialog id="modalConfirm" className="modal">
                <div className="w-[50%] h-auto flex flex-col justify-between bg-white rounded-lg p-5">
                    <HeaderModal name={'warning'} />
                    <div className="p-5 text-lg">
                        {'Do you want to remove this message'}
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-4">
                        <form method="dialog">
                            <button className="btn btn-outline">Cancel</button>
                        </form>
                        <button className="btn btn-secondary" id="confirmButton">Confirm</button>
                    </div>
                </div>
            </dialog>
        </div>
    )
}