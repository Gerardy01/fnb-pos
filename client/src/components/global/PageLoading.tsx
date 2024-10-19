
import { Spin } from "antd"

export default function PageLoading() {
    return (
        <section style={styles.container}>
            <Spin tip="Loading..." size="large">
                <div style={styles.content} />
            </Spin>
        </section>
    )
}

const styles : { [key: string]: React.CSSProperties } = {
    container : {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        padding: 50,
        background: 'rgba(0, 0, 0, 0.10)',
        borderRadius: 4,
    }
}