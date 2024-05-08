import icons from "../shared/icon";

export function SelectedCard({ props, removeFromSelected }) {
    return (
        <div key={props._id} className="w-auto h-12 p-2 text-nowrap flex gap-2 justify-between rounded-lg border-pink-500 border-2 text-secondary">
            {props.name}
            <div onClick={() => removeFromSelected(props)} className="hover:bg-pink-300 flex justify-center items-center p-1 rounded-full">{icons.xClose}</div>
        </div>
    )
}