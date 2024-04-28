import { useDispatch } from "react-redux"
import { setCurrentConversation, setViewState } from "../../hooks/redux/reducer"
import { getListMessageByConversation } from "../shared/api"

export default function GroupCard({ props }) {
    const dispatch = useDispatch()

    function openGroupChat() {
        console.log(props)
        dispatch(setCurrentConversation(props))
        dispatch(setViewState({
            box: 'chat',
            subSideBar: 'chat'
        }))
        getListMessageByConversation(props._id, dispatch)
    }

    return (
        <div className="p-2 w-auto">
            <div className={`flex justify-between items-center p-4 gap-2 bg-white rounded-lg hover:bg-pink-100`}>
                <div className="flex justify-start items-center gap-3">
                    <div className="avatar">
                        <div className="avatar w-12 h-12 rounded-full bg-black">
                            <img src={props.image} alt="avatar" />
                        </div>
                    </div>
                    <label className="font-semibold text-lg">{props.name && props.name}</label>
                </div>
                <div className="flex justify-center items-center gap-2">
                    <button className="btn btn-secondary" onClick={() => { openGroupChat() }}>Chat</button>
                </div>
            </div>
        </div>
    )
}