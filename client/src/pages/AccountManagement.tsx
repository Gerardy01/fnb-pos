
import { Typography } from 'antd';

const { Title } = Typography;


export default function AccountManagement() {
    return (
        <div>
            <Title level={3}>Account Management</Title>
            <div style={styles.contentHolder}>
                account management
            </div>
        </div>
    )
}

const styles : { [key: string]: React.CSSProperties } = {
    contentHolder : {
        width: '100%',
        marginTop: '3rem'
    }
}