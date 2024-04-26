import axios from "axios";
import ConversationCard from "../../../components/common/ConversationCard";
import ConversationSkeleton from "../../../components/common/ConversationSkeleton";
import icons from "../../../components/shared/icon";
import AddFriendModal from "./modals/AddFriendModal";
import { BASE_URL, userToken } from "../../../components/shared/api";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentConversation, setListConversation, setListMessage } from "../../../hooks/redux/reducer";

export default function SubSideBar() {
    // const [listConversation, setListConversation] = useState();
    // const cc = useSelector((state) => state.currentConversation)
    const reduxListConversation = useSelector((state) => state.listConversation);
    const [isLoading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const onClose = (id) => {
        id && document.getElementById(id).close();
    }

    const onConversationClick = async (e) => {
        console.log(e);
        // try {
        //     const response = await axios({
        //         url: BASE_URL + `/api/v1/conservations/open/${e._id}`,
        //         method: 'POST',
        //         headers: { Authorization: `Bearer ${userToken}` }
        //     })
        //     console.log(response);
        //     console.log(userToken);
        //     dispatch(setCurrentConversation(e))
        // } catch (error) {
        //     console.log(error);
        // }

        dispatch(setCurrentConversation(e))
        getListMessageByConversation(e._id)
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

    const getListConversation = async () => {
        setLoading(true)
        try {
            const response = await axios({
                url: BASE_URL + "/api/v1/conservations",
                method: 'GET',
                headers: { Authorization: `Bearer ${userToken}` },
                params: { type: 'private' }
            })
            console.log(response);
            dispatch(setListConversation(response.data.data))
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

    useEffect(() => {
        getListConversation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{ width: 320, height: '100%' }} className="bg-gray-100 flex flex-col">
            <div className="w-full bg-white flex justify-between items-center gap-2 p-4">
                <label className="w-48 h-10 bg-pink-100 input input-bordered flex items-center gap-2">
                    <input type="text" className="grow" placeholder="Search" />
                </label>
                <div className="text-black hover:bg-pink-200 p-2 rounded-lg cursor-pointer" onClick={() => document.getElementById("addFriendModal").showModal()}>{icons.addFriend}</div>
                <div className="text-black hover:bg-pink-200 p-2 rounded-lg cursor-pointer">{icons.createGroup}</div>
            </div>
            <div className="overflow-auto scroll-smooth">
                {!isLoading && reduxListConversation ? reduxListConversation.map((e) => (<div key={e._id} onClick={() => onConversationClick(e)}>
                    <ConversationCard props={e} />
                </div>
                )) : <ConversationSkeleton />}
            </div>
            <div style={{ width: '100%', height: 10, position: 'relative' }}>

            </div>

            <dialog id="addFriendModal" className="modal">
                <AddFriendModal onClose={onClose} />
            </dialog>
        </div>
    )
}