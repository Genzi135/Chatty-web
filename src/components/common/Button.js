function Button({ value }) {

    const onCancelClick = () => {
        return value('cancel')
    }
    const onConfirmClick = () => {
        return value('confirm')
    }

    return (
        <div className="flex items-center justify-end gap-2 mt-4">
            <button className="btn btn-outline" onClick={() => onCancelClick()}>Cancel</button>
            <button className="btn btn-secondary" onClick={() => onConfirmClick()}>Confirm</button>
        </div>
    )
}

export default Button;