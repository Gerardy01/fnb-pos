
// types and interfaces
interface Props {
    maxWidth? : string;
    bgColor? : string;
    children : JSX.Element;
}



export default function Container({ children, maxWidth="75rem", bgColor="#f0f2f5" } : Props) {
    return (
        <section style={{ ...styles.section, backgroundColor: bgColor }}>
            <div style={{ ...styles.contentContainer, maxWidth: maxWidth }}>
                {children}
            </div>
        </section>
    )
}

const styles : { [key: string]: React.CSSProperties } = {
    section : {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '0px 2rem'
    },
    contentContainer : {
        flex: 1
    },
}