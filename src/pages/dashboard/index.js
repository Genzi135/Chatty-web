import { useSelector } from "react-redux";
import Chat from "./chatBox";
import SideBar from "./sideBar/SideBar";
import SubSideBar from "./sideBar/SubSideBar";
import Contact from "./contact";

export default function Dashboard() {
    const viewState = useSelector(state => state.view)
    return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center' }}>
            <SideBar />
            <SubSideBar />
            {viewState.subSideBar === 'chat' && <Chat />}
            {viewState.subSideBar === "contact" && <Contact />}
        </div>
    )
}