import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "../../helpers/formatDate";
import { getListMessageByConversation, handleAcceptFriendRequest, handleGetFriendRequest, handleOpenConversation, handleRejectFriendRequest, handleRemoveFriend } from "../shared/api";
import { setCurrentConversation, setViewState } from "../../hooks/redux/reducer";

export default function RequestReceiveCard({props, dataSource}){
    const dispatch = useDispatch()
    const listConversation = useSelector(state => state.listConversation)

    function refreshList() {
        handleGetFriendRequest()
            .then(response => dataSource(response.data.data))
    }

    function openChat() {
        console.log(props)
        dispatch(setCurrentConversation(props))
        dispatch(setViewState({
            box: 'chat',
            subSideBar: 'chat'
        }))
        getListMessageByConversation(props._id, dispatch)
    }

    function AcceptFriend() {
        handleAcceptFriendRequest(props._id)
        handleOpenConversation(props.userId, dispatch, listConversation)
        refreshList()
    }

    return(
        <div className="p-2 w-auto">
        <div className={`flex justify-between items-center p-4 gap-2 bg-white rounded-lg hover:bg-pink-100`}>
            <div className="flex justify-start items-center gap-3">
            <div className="avatar">
                <div className="avatar w-16 h-16 rounded-full bg-black">
                    <img src={props.avatar} alt="avatar" />
                </div>
            </div>
            <div className="flex flex-col justify-around">
            <label className="font-semibold text-lg">{props.name&&props.name}</label>
            {/* <label className="text-gray-300 text-sm">{formatDate()} day</label> */}
            </div>
            </div>
            <div className="flex justify-center items-center gap-2">
                <button className="btn btn-secondary text-white" onClick={() => {AcceptFriend()}}>Accept</button>
                <button className="btn btn-secondary btn-outline" onClick={() => {handleRejectFriendRequest(props._id); refreshList()}}>Reject</button>
            </div>
        </div>
    </div>
    )
}