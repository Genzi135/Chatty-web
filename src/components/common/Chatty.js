export default function Chatty() {
    return (<div className="w-[auto] h-[70vh] flex flex-col justify-center items-center gap-2">
        <label style={StyleSheet.label}>C</label>
        <label style={StyleSheet.label}>H</label>
        <label style={StyleSheet.label}>A</label>
        <label style={StyleSheet.label}>T</label>
        <label style={StyleSheet.label}>T</label>
        <label style={StyleSheet.label}>Y</label>
    </div>)
}

export const StyleSheet = {
    label: {
        color: 'white',
        fontSize: '2rem',
        fontWeight: 'bold',
        textShadow: '0 0 10px Violet, 0 0 20px Violet'
    }
}