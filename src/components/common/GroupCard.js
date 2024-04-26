export default function GroupCard({props}){
    return(
        <div className="p-2 w-auto">
        <div className={`flex justify-between items-center p-4 gap-2 bg-white rounded-lg hover:bg-pink-100`}>
            <div className="flex justify-start items-center gap-3">
            <div className="avatar">
                <div className="avatar w-16 h-16 rounded-full bg-black">
                    <img src={props.image} alt="avatar" />
                </div>
            </div>
            <label className="font-semibold text-lg">{props.name&&props.name}</label>
            </div>
            <div className="flex justify-center items-center gap-2">
                <button className="btn btn-secondary">Chat</button>
            </div>
        </div>
    </div>
    )
}