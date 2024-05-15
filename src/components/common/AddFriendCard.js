import { handleCancelFriendRequest, handleSendFriendRequest } from "../shared/api";

export default function AddFriendCard({ props, value }) {
    console.log(props)
    const onCancelClick = () => {
        return value('cancel')
    }
    const onConfirmClick = () => {
        return value('confirm')
    }

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
                {
                    props.friend ? (<div>
                        {
                            props.friend.status === 'pending' && <button className="btn btn-active" onClick={() => onCancelClick()}>Cancel</button>
                        }
                        {
                            props.friend.status === 'accepted' && <div></div>
                        }
                    </div>) : (<button className="btn btn-secondary text-white" onClick={() => onConfirmClick()}>Add</button>)
                }
            </div>
        </div>
    )
}