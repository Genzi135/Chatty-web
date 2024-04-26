import { useSelector } from "react-redux"
import icons from "../../../components/shared/icon";

export default function Contact() {
    const viewState = useSelector(state => state.view)
    console.log(viewState);
    return (
        <div style={{ width: '100%', height: '100vh' }}>
            {viewState.box === 'contact' && <div className="flex flex-col gap-2">
                <div className="flex justify-start items-center bg-pink-300 p-5 gap-2">
                    {icons.listFriend}
                    <label className="font-semibold text-xl">Friend list</label>
                </div>
                <div className="h-full w-full p-2">
                    <div className="bg-gray-100 h-full w-full p-2 flex flex-col">

                    </div>
                </div>
            </div>}
            {viewState.box === 'group' && <div className="flex flex-col gap-2">
                <div className="flex justify-start items-center bg-pink-300 p-5 gap-2">
                    {icons.listGroup}
                    <label className="font-semibold text-xl">Group list</label>
                </div>
                <div className="h-full w-full p-2">
                    <div className="bg-gray-100 h-full w-full p-2 flex flex-col">

                    </div>
                </div>
            </div>}
            {viewState.box === 'request' && <div className="flex flex-col gap-2">
                <div className="flex justify-start items-center bg-pink-300 p-5 gap-2">
                    {icons.listRequest}
                    <label className="font-semibold text-xl">Request list</label>
                </div>
                <div className="h-full w-full p-2">
                    <div className="bg-gray-100 h-full w-full p-2 flex flex-col">

                    </div>
                </div>
            </div>}
        </div>
    )
}