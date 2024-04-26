import axios from "axios";
import ConversationCard from "../../../components/common/ConversationCard";
import ConversationSkeleton from "../../../components/common/ConversationSkeleton";
import icons from "../../../components/shared/icon";
import AddFriendModal from "./modals/AddFriendModal";
import { BASE_URL, getListConversation, userToken } from "../../../components/shared/api";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentConversation, setListConversation, setListMessage, setViewState } from "../../../hooks/redux/reducer";

export default function SubSideBar() {

    const dispatch = useDispatch();

    const reduxListConversation = useSelector((state) => state.listConversation);
    const viewState = useSelector((state) => state.view);
    // console.log(viewState);

    const [isLoading, setLoading] = useState(false);
    const [isFLSelected, setFLSelected] = useState(true);
    const [isGLSelected, setGLSelected] = useState(false);
    const [isRLSelected, setRLSelected] = useState(false);

    const onClose = (id) => {
        id && document.getElementById(id).close();
    }

    const onConversationClick = async (e) => {
        console.log(e);
        dispatch(setCurrentConversation(e))
        getListMessageByConversation(e._id)
    }

    const setViewFriendList = () => {
        setFLSelected(true)
        setGLSelected(false)
        setRLSelected(false)
        const view = {
            box: 'contact',
            subSideBar: 'contact'
        }
        dispatch(setViewState(view))
    }

    const setViewGroupList = () => {
        setFLSelected(false)
        setGLSelected(true)
        setRLSelected(false)
        const view = {
            box: 'group',
            subSideBar: 'contact'
        }
        dispatch(setViewState(view))
    }

    const setViewRequestList = () => {
        setFLSelected(false)
        setGLSelected(false)
        setRLSelected(true)
        const view = {
            box: 'request',
            subSideBar: 'contact'
        }
        dispatch(setViewState(view))
    }

    const getListMessageByConversation = async (id) => {
        try {
            const response = await axios({
                url: BASE_URL + `/api/v1/conservations/${id}/messages`,
                method: 'GET',
                headers: { Authorization: `Bearer ${userToken}` }
            })
            console.log(response);
            dispatch(setListMessage(response.data.data.reverse()))
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        console.log(reduxListConversation)
        getListConversation(dispatch);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{ width: 320, height: '100vh' }} >
            {viewState && viewState.subSideBar === 'chat' && <div style={{ width: 320 }} className="bg-gray-100 flex flex-col">
                <div className="w-full bg-white flex justify-between items-center gap-2 p-4">
                    <label className="w-48 h-10 bg-pink-100 input input-bordered flex items-center gap-2">
                        <input type="text" className="grow" placeholder="Search" />
                    </label>
                    <div className="text-black hover:bg-pink-200 p-2 rounded-lg cursor-pointer" onClick={() => document.getElementById("addFriendModal").showModal()}>{icons.addFriend}</div>
                    <div className="text-black hover:bg-pink-200 p-2 rounded-lg cursor-pointer">{icons.createGroup}</div>
                </div>
                <div className="overflow-auto scroll-smooth">
                    {!isLoading && reduxListConversation ? (reduxListConversation.map((e) => (<div key={e._id} onClick={() => onConversationClick(e)}>
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
                    <div onClick={() => setViewFriendList()} className={`flex items-center w-full gap-2 p-4 ${viewState.box === 'contact' ? "bg-pink-300" : "bg-white hover:bg-pink-100"} `}>
                        <div>{icons.listFriend}</div>
                        <label className="font-semibold ">Friend list</label>
                    </div>
                    <div onClick={() => setViewGroupList()} className={`flex items-center w-full gap-2 p-4 ${viewState.box === 'group' ? "bg-pink-300" : "bg-white hover:bg-pink-100"} `}>
                        <div>{icons.listGroup}</div>
                        <label className="font-semibold ">Group list</label>
                    </div>
                    <div onClick={() => setViewRequestList()} className={`flex items-center w-full gap-2 p-4 ${viewState.box === 'request' ? "bg-pink-300" : "bg-white hover:bg-pink-100"} `}>
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