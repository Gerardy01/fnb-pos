
// types and interfaces
interface Props {
    children : JSX.Element;
}



export default function Container({ children } : Props) {
    return (
        <section style={styles.section}>
            <div style={styles.contentContainer}>
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
        maxWidth: '75rem',
        flex: 1
    },
}