
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from "antd"


export default function ContentLoading() {
    return (
        <div style={styles.holder}>
            <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
    )
}

const styles : { [key: string]: React.CSSProperties } = {
    holder : {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'       
    }
}