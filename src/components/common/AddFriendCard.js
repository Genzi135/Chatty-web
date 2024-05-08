import { handleSendFriendRequest } from "../shared/api";

export default function AddFriendCard({ props }) {
    return (
        <div className="p-2 w-auto bg-gray-100 mt-5">
            <div className={`flex justify-between items-center p-4 gap-2 bg-white rounded-lg rounded-lg hover:bg-pink-100`}>
                <div className="flex justify-start items-center gap-3">
                    <div className="avatar">
                        <div className="avatar w-12 h-12 rounded-full bg-black">
                            {
                                props &&
                                <img src={props.avatar} alt="avatar" />
                            }
                        </div>
                    </div>
                    <label className="font-semibold text-lg">{props && props.name}</label>
                </div>
                <div>
                    {
                        props.friend.status === 'pending' && <button className="btn btn-disabled">Cancel</button>
                    }
                    {
                        props.friend === null && <button className="btn btn-secondary text-white" onClick={() => handleSendFriendRequest(props._id)}>Add</button>
                    }
                    {
                        props.friend.status === 'accepted' && <div></div>
                    }
                </div>
            </div>
        </div>
    )
}