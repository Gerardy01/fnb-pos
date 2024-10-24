
import { Menu } from 'antd';
import { Outlet } from "react-router-dom";

import useCommonLayout from '../../hooks/global/useCommonLayout';

// components
import Navbar from './Navbar';

export default function CommonLayout() {

    const { collapsed, filteredSidebarItems, activeMenuItem, handleCollapse } = useCommonLayout();
    
    return (
        <section style={styles.section}>
            <Navbar collapsed={collapsed} handleCollapse={handleCollapse} />
            
            <div style={styles.container}>
                <div 
                    style={{
                        ...styles.menuHolder,
                        width: collapsed ? "fit-content" : "256px"
                    }}
                >
                    {activeMenuItem && filteredSidebarItems.length > 0 ? (
                        <Menu
                            defaultSelectedKeys={[activeMenuItem]}
                            // defaultOpenKeys={defaultOpenKey}
                            mode="inline"
                            theme="light"
                            inlineCollapsed={collapsed}
                            items={filteredSidebarItems}
                            style={styles.menu}
                        />
                    ) : (
                        <div style={styles.sidebarDecoy} />
                    )}
                </div>
                <div style={styles.contentHolder}>
                    <Outlet />
                </div>
            </div>
        </section>
    )
}

const styles : { [key: string]: React.CSSProperties } = {
    section : {
        width: '100vw',
        height: '100vh',
        display: "flex",
        flexDirection: 'column'
    },
    container : {
        width: '100%',
        flex: 1,
        display: 'flex'
    },
    menuHolder : {
        height : '100%'
    },
    menu : {
        height: '100%'
    },
    contentHolder : {
        flex: 1,
        backgroundColor: '#f0f2f5',
        padding: '1.5rem'
    },
    sidebarDecoy : {
        width: '5rem',
        backgroundColor: 'white'
    }
}