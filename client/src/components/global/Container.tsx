
// types and interfaces
interface Props {
    maxWidth? : string;
    children : JSX.Element;
}



export default function Container({ children, maxWidth } : Props) {
    return (
        <section style={styles.section}>
            <div style={{ ...styles.contentContainer, maxWidth: maxWidth ? maxWidth : '75rem' }}>
                {children}
            </div>
        </section>
    )
}

const styles : { [key: string]: React.CSSProperties } = {
    section : {
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
    },
    contentContainer : {
        flex: 1
    },
}