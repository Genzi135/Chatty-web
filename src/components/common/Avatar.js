export default function Avatar({ link }) {
    return (
        <div className="avatar">
            <div className=" avatar rounded-full bg-black w-12 h-12  shadow-2xl">
                <img src={link} alt="avatar" />
            </div>
        </div>
    )
}