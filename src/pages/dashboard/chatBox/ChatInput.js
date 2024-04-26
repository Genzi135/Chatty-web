import icons from "../../../components/shared/icon";

export default function ChatInput() {
    return (
        <div className="flex flex-col w-full h-auto">
            <div className="flex p-2 justify-start gap-2 bg-pink-300">
                <div className="p-1 rounded-lg text-white hover:bg-pink-500">
                    {icons.image}
                </div>
                <div className="p-1 rounded-lg text-white hover:bg-pink-500">
                    {icons.video}
                </div>
                <div className="p-1 rounded-lg text-white hover:bg-pink-500">
                    {icons.folderFile}
                </div>
            </div>
            <div className="flex justify-between items-center pt-2 pb-2 gap-2 p-5">
                <div className="w-full h-auto">
                    <input className="input w-full input-secondary" />
                </div>
                <div className="btn btn-secondary">
                    <label>SEND</label>
                </div>
            </div>
        </div>
    )
}