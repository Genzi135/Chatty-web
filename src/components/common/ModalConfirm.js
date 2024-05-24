
import Button from "./Button";
import HeaderModal from "./HeaderModal";

export default function ModalConfirm({ type, title, setOption, onClose }) {

    return (
        <div className="w-[50%] h-auto flex flex-col justify-between bg-white rounded-lg p-5">
            <HeaderModal name={type} />
            <div className="p-5 text-lg">
                {title}
            </div>
            <Button value={setOption} />
        </div>
    )
}