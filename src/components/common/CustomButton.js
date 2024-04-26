function CustomButton([name, color]) {
    return (
        <div>
            <button className="btn" color={color}>{name}</button>
        </div>
    )
}

export default CustomButton;