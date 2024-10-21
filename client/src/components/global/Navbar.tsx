
import { Button, Avatar, Dropdown, Typography } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

import useCommonLayout from "../../hooks/useCommonLayout";

// utils
import { getShortenName } from "../../utils/utility";

// types and interfaces
interface NavbarProps {
    collapsed : boolean;
    handleCollapse : () => void;
}

const { Text } = Typography;



export default function Navbar({ collapsed, handleCollapse } : NavbarProps) {

    const { userInfo, dropdownItems } = useCommonLayout();

    return (
        <nav style={styles.navbar}>
            <Button
                type="primary"
                onClick={handleCollapse}
            >
                {collapsed ? <MenuUnfoldOutlined /> : < MenuFoldOutlined/>}
            </Button>

            <Dropdown
                menu={{ items: dropdownItems }}
                placement="bottomRight"
                trigger={['click']}
            >
            <div style={styles.dropdownButton}>
                <Avatar
                    style={styles.avatar}
                    gap={8}
                >
                    {getShortenName(userInfo.name)}
                </Avatar>
                <Text
                    strong
                    ellipsis
                >{userInfo.name}</Text>
            </div>
            </Dropdown>
        </nav>
    )
}

const styles : { [key: string]: React.CSSProperties } = {
    navbar : {
        width: '100%',
        height: '3.5rem',
        backgroundColor: 'white',
        borderBottom: '1px solid #f0f2f5',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0px 1.1rem',
        alignItems: 'center'
    },
    dropdownButton : {
        maxWidth: '12rem',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center'
    },
    avatar : {
        marginRight: '10px'
    }
}