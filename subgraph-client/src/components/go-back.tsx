 
import { Link, useNavigate } from "react-router-dom";



export default function GoBackLink() {
    const navigate = useNavigate();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault(); // 阻止默认导航
        navigate(-1); // 回退到上一页 
    };
    return (<Link to="#" onClick={handleClick} className="text-blue-500 hover:underline">
        ← Go Back
    </Link>)
}