import icon from '../shared/icon'

function HeaderModal({ name }) {
    return (
        <div className="flex items-center justify-between mb-4">
            <label className="text-black text-lg font-bold">
                {name}
            </label>
            <form method='dialog'>
                <label>
                    {icon.xCloseAnimation}
                </label>
            </form>
        </div>
    )
}

export default HeaderModal;