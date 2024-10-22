
import { Button, Avatar, Dropdown, Typography } from "antd";
import { DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

import useNavbar from "../../hooks/global/useNavbar";

// utils
import { getShortenName } from "../../utils/utility";

// types and interfaces
interface NavbarProps {
    collapsed : boolean;
    handleCollapse : () => void;
}

const { Text, Title } = Typography;



export default function Navbar({ collapsed, handleCollapse } : NavbarProps) {

    const { userInfo, dropdownItems } = useNavbar();

    return (
        <nav style={styles.navbar}>
            <div style={styles.leftContainer}>
                <Button
                    type="primary"
                    onClick={handleCollapse}
                >
                    {collapsed ? <MenuUnfoldOutlined /> : < MenuFoldOutlined/>}
                </Button>
                <Title
                    level={5}
                    style={styles.title}
                >{userInfo.organizationName}</Title>
            </div>

            <Dropdown
                menu={{ items: dropdownItems }}
                placement="bottomRight"
                trigger={['click']}
            >
            <div style={styles.dropdownButton}>
                <div style={styles.avatarHolder}>
                    <Avatar
                        gap={8}
                    >
                        {getShortenName(userInfo.name)}
                    </Avatar>
                </div>
                <Text
                    strong
                    ellipsis
                >{userInfo.name}</Text>
                <DownOutlined style={styles.downButton} />
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
    avatarHolder : {
        width: '2rem',
        marginRight: '10px'
    },
    leftContainer : {
        display: 'flex',
        alignItems: 'center'
    },
    title : {
        marginLeft: '1.1rem',
        marginBottom: '0px'
    },
    downButton : {
        marginLeft: '10px',
        fontSize: '0.7rem',
        marginBottom: '-3px'
    }
}