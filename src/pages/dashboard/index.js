import Chat from "./chatBox";
import SideBar from "./sideBar/SideBar";
import SubSideBar from "./sideBar/SubSideBar";

export default function Dashboard() {
    return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center' }}>
            <SideBar />
            <SubSideBar />
            <Chat />
        </div>
    )
}