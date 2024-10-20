

// types and interfaces
interface NavbarProps {
    collapsed : boolean;
    handleCollapse : () => void;
}

export default function Navbar({ collapsed, handleCollapse } : NavbarProps) {

    return (
        <div>
            <button onClick={() => {
                handleCollapse();
            }}>test</button>
        </div>
    )
}