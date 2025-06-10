import { Empty } from "antd";




export default function ContentNotFound() {
    return (
        <div
            style={styles.noContentHolder}
        >
            <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
        </div>
    )
}

const styles : { [key: string]: React.CSSProperties } = {
    noContentHolder : {
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent : 'center',
        alignItems: 'center'
    },
}