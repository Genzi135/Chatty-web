import { formatDate } from "../../helpers/formatDate";
import { handleAcceptFriendRequest, handleGetFriendRequest, handleRejectFriendRequest, handleRemoveFriend } from "../shared/api";

export default function RequestReceiveCard({props, dataSource}){
    function refreshList() {
        handleGetFriendRequest()
            .then(response => dataSource(response.data.data))
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
                <button className="btn btn-secondary text-white" onClick={() => {handleAcceptFriendRequest(props._id); refreshList()}}>Accept</button>
                <button className="btn btn-secondary btn-outline" onClick={() => {handleRejectFriendRequest(props._id); refreshList()}}>Reject</button>
            </div>
        </div>
    </div>
    )
}