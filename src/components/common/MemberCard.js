
export default function MemberCard({ props }) {
    return (
        <div className="p-2 w-auto">
            <div className={`flex justify-start items-center p-4 : bg-white rounded-lg shadow-sm gap-3 w-full hover:bg-pink-100`}>
                <div className="avatar">
                    <div className="avatar w-12 h-12 rounded-full bg-black">
                        <img src={props.avatar} alt="avatar" />
                    </div>
                </div>
                <div className="flex justify-between w-full">
                    <div className="flex flex-col justify-around w-full gap-2">
                        <label className="text-black text-base font-semibold text-ellipsis whitespace-nowrap overflow-hidden w-48">
                            {props.name ? props.name : ""}
                        </label>

                    </div>

                </div>
            </div>
        </div>
    );
}
