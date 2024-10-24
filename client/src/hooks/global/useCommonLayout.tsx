import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import {
    ApartmentOutlined,
    DesktopOutlined,
    HomeOutlined,
    ToolOutlined,
} from '@ant-design/icons';

import { PageAccessPermissionEnum } from '../../utils/enums';

// redux
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

// types and interfaces
import type { MenuProps } from 'antd';
type MenuItem = Required<MenuProps>['items'][number];
type CustomMenuItem = MenuItem & {
    permissions?: number[];
    children?: CustomMenuItem[];
};



export default function useCommonLayout() {

    const location = useLocation();
    const navigate = useNavigate();
    const userInfo = useSelector((state : RootState) => state.userInfo);

    const [collapsed, setCollapsed] = useState<boolean>(true);
    const [activeMenuItem, setActiveMenuItem] = useState<string>("");
    // const [defaultOpenKey, setDefaultOpenKey] = useState<string[] | null>(null);
    const [filteredSidebarItems, setFilteredSidebarItems] = useState<CustomMenuItem[]>([]);

    useEffect(() => {
        filterSidebarItem();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setActiveMenuItem(location.pathname);
    }, [location.pathname]);

    // useEffect(() => {
    //     defaultOpenKeyChecker();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [activeMenuItem]);

    const handleCollapse = () : void => {
        setCollapsed(prev => !prev);
    }

    const handleClick = (url : string) : void => {
        navigate(url);
    }

    const filterSidebarItem = () => {
        const filtered = sidebarItems
            .filter(item =>
                !item.permissions || item.permissions.some(permission => userInfo.pageAccessPermissions.includes(permission))
            )
            .map(item => {
                if (!item.children) return item;
                
                const filteredChildren = item.children.filter(child =>
                    !child.permissions || child.permissions.some(permission => userInfo.pageAccessPermissions.includes(permission))
                )
                return {
                    ...item,
                    children: filteredChildren
                }
            });
        setFilteredSidebarItems(filtered);
    }

    // const defaultOpenKeyChecker = () => {
    //     if (!activeMenuItem) return;

    //     let isFind = false;
    //     sidebarItems.forEach(data => {
    //         if (!data.children) return;
            
    //         const childWithActiveMenu = data.children.find(item => item.key === activeMenuItem);
    //         if (!childWithActiveMenu) return;
    //         const menuKey = data.key ? data.key.toString() : "";
    //         setDefaultOpenKey([menuKey]);
    //         isFind = true;
    //     });

    //     if (!isFind) setDefaultOpenKey([]);
    // }

    const sidebarItems: CustomMenuItem[] = [
        {
            key: '/dashboard',
            icon: <HomeOutlined />,
            label: 'Dashboard',
            onClick: () => handleClick("/dashboard")
        },
        {
            key: '/pos',
            icon: <DesktopOutlined />,
            label: 'POS',
            permissions: [PageAccessPermissionEnum.POS],
            onClick: () => handleClick("/pos"),
        },
        {
            key: 'management',
            label: 'Management',
            icon: <ApartmentOutlined />,
            permissions: [
                PageAccessPermissionEnum.ACCOUNT_MANAGEMENT,
                PageAccessPermissionEnum.ROLE_MANAGEMENT,
            ],
            children: [
                {
                    key: '/account-management',
                    label: 'Account',
                    permissions: [PageAccessPermissionEnum.ACCOUNT_MANAGEMENT],
                    onClick: () => handleClick("/account-management"),
                },
                {
                    key: '/role-management',
                    label: 'Role',
                    permissions: [PageAccessPermissionEnum.ROLE_MANAGEMENT],
                    onClick: () => handleClick("/role-management"),
                },
            ],
        },
        {
            key: 'config',
            label: 'Configuration',
            icon: <ToolOutlined />,
            permissions: [PageAccessPermissionEnum.ORGANIZATION_SETTINGS],
            children: [
                {
                    key: 'organization-settings',
                    label: 'Organization',
                    permissions: [PageAccessPermissionEnum.ORGANIZATION_SETTINGS],
                    onClick: () => handleClick("/organization-settings"),
                }
            ]
        }
    ];

    return {
        filteredSidebarItems,
        collapsed,
        activeMenuItem,
        handleCollapse,
    }
}