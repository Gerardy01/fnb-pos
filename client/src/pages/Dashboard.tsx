
import { useNavigate } from "react-router-dom"


export default function Dashboard() {

    const navigate = useNavigate();

    return (
        <div onClick={() => navigate("/login")}>
            dashboard
        </div>
    )
}