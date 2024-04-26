import axios from "axios";
import ConversationCard from "../../../components/common/ConversationCard";
import ConversationSkeleton from "../../../components/common/ConversationSkeleton";
import icons from "../../../components/shared/icon";
import AddFriendModal from "./modals/AddFriendModal";
import { BASE_URL, getListConversation, getListMessageByConversation, userToken } from "../../../components/shared/api";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentConversation, setListConversation, setListMessage, setViewState } from "../../../hooks/redux/reducer";

export default function SubSideBar() {

    const dispatch = useDispatch();

    const reduxListConversation = useSelector((state) => state.listConversation);
    const viewState = useSelector((state) => state.view);
    // console.log(viewState);

    const [isLoading, setLoading] = useState(false);

    const [inputValue, setInput] = useState((''))
    const [dataSource, setDataSource] = useState([])

    useEffect(() => {
        setDataSource(reduxListConversation)
    }, [reduxListConversation])

    const setInputValue = (e) => {
        setInput(e.target.value)
    }

    const onClose = (id) => {
        id && document.getElementById(id).close();
    }

    const onConversationClick = async (e) => {
        console.log(e);
        dispatch(setCurrentConversation(e))
        getListMessageByConversation(e._id, dispatch)
    }

    const setViewList = (box) => {
        dispatch(setViewState({
            box: box,
            subSideBar: 'contact'
        }))
    }

    useEffect(() => {
        console.log(reduxListConversation)
        getListConversation(dispatch);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function searchUser() {
        let found = [];
        reduxListConversation.map((e) => {
            console.log(inputValue)
            if (e.name.includes(inputValue)) {
                found.push(e);
            }
        })
        setDataSource(found)
    }

    const keyPressed = (e) => {
        if (e.key === 'Enter')
            searchUser()
    }

    return (
        <div style={{ width: 320, height: '100vh' }} >
            {viewState && viewState.subSideBar === 'chat' && <div style={{ width: 320 }} className="bg-gray-100 flex flex-col">
                <div className="w-full bg-white flex justify-between items-center gap-2 p-4">
                    <label className="w-48 h-10 bg-pink-100 input input-bordered flex items-center gap-2">
                        <input type="text" className="grow" placeholder="Search" onChange={setInputValue} onKeyDown={keyPressed}/>
                    </label>
                    <div className="text-black hover:bg-pink-200 p-2 rounded-lg cursor-pointer" onClick={() => document.getElementById("addFriendModal").showModal()}>{icons.addFriend}</div>
                    <div className="text-black hover:bg-pink-200 p-2 rounded-lg cursor-pointer">{icons.createGroup}</div>
                </div>
                <div className="overflow-auto scroll-smooth">
                    {!isLoading && dataSource ? (dataSource.map((e) => (<div key={e._id} onClick={() => onConversationClick(e)}>
                        <ConversationCard props={e} />
                    </div>
                    ))) : (<ConversationSkeleton />)}
                </div>
                <div style={{ width: '100%', height: 10, position: 'relative' }}>

                </div>

                <dialog id="addFriendModal" className="modal">
                    <AddFriendModal onClose={onClose} />
                </dialog>
            </div>}
            {viewState && viewState.subSideBar === 'contact' && <div style={{ width: 320 }} className="bg-gray-100 flex flex-col">
                <div className="w-full bg-white flex justify-between items-center gap-2 p-4">
                    <label className="w-48 h-10 bg-pink-100 input input-bordered flex items-center gap-2">
                        <input type="text" className="grow" placeholder="Search" />
                    </label>
                    <div className="text-black hover:bg-pink-200 p-2 rounded-lg cursor-pointer" onClick={() => document.getElementById("addFriendModal").showModal()}>{icons.addFriend}</div>
                    <div className="text-black hover:bg-pink-200 p-2 rounded-lg cursor-pointer">{icons.createGroup}</div>
                </div>
                <div className="overflow-auto flex flex-col scroll-smooth mt-2 gap-2 p-2">
                    {/* body */}
                    <div onClick={() => setViewList('contact')} className={`flex items-center w-full gap-2 p-4 ${viewState.box === 'contact' ? "bg-pink-300" : "bg-white hover:bg-pink-100"} `}>
                        <div>{icons.listFriend}</div>
                        <label className="font-semibold ">Friend list</label>
                    </div>
                    <div onClick={() => setViewList('group')} className={`flex items-center w-full gap-2 p-4 ${viewState.box === 'group' ? "bg-pink-300" : "bg-white hover:bg-pink-100"} `}>
                        <div>{icons.listGroup}</div>
                        <label className="font-semibold ">Group list</label>
                    </div>
                    <div onClick={() => setViewList('request')} className={`flex items-center w-full gap-2 p-4 ${viewState.box === 'request' ? "bg-pink-300" : "bg-white hover:bg-pink-100"} `}>
                        <div>{icons.listRequest}</div>
                        <label className="font-semibold ">Request list</label>
                    </div>

                </div>
                <div style={{ width: '100%', height: 10, position: 'relative' }}>

                </div>

                <dialog id="addFriendModal" className="modal">
                    <AddFriendModal onClose={onClose} />
                </dialog>
            </div>}
        </div>
    )
}