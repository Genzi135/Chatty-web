function CustomButton([name, color]) {
    return (
        <div>
            <button className="btn btn-secondary" color={color}>{name}</button>
        </div>
    )
}

export default CustomButton;