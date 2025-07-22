import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import {
    BarChartOutlined,
    BookOutlined,
    // ApartmentOutlined,
    DesktopOutlined,
    HomeOutlined,
    LayoutOutlined,
    ToolOutlined,
    UserSwitchOutlined,
} from '@ant-design/icons';

import { useTranslation } from 'react-i18next';
import useCache from '../useCache';

// utils
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

    const { t } = useTranslation('global');
    const { getSidebarCollapsedInfo, setSidebarCollapsedInfo } = useCache();

    const [collapsed, setCollapsed] = useState<boolean>(true);
    const [activeMenuItem, setActiveMenuItem] = useState<string>("");
    // const [defaultOpenKey, setDefaultOpenKey] = useState<string[] | null>(null);
    const [filteredSidebarItems, setFilteredSidebarItems] = useState<CustomMenuItem[]>([]);

    useEffect(() => {
        filterSidebarItem();
        handleGetCollapseInfo();
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
        handleSetCollapseInfo();
        setCollapsed(prev => !prev);
    }

    const handleClick = (url : string) : void => {
        navigate(url);
    }

    const handleGetCollapseInfo = () : void => {
        const collapsedInfo = getSidebarCollapsedInfo();
        setCollapsed(collapsedInfo);
    }

    const handleSetCollapseInfo = () : void => {
        setSidebarCollapsedInfo(!collapsed);
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
            label: t('dashboard'),
            onClick: () => handleClick("/dashboard")
        },
        {
            key: '/pos',
            icon: <DesktopOutlined />,
            label: t('pos'),
            permissions: [PageAccessPermissionEnum.POS],
            onClick: () => handleClick("/pos"),
        },
        {
            key: 'catalog',
            label: t('catalougue'),
            icon: <BookOutlined />,
            permissions: [
                PageAccessPermissionEnum.CATEGORY_MANAGEMENT,
                PageAccessPermissionEnum.MODIFIER_MANAGEMENT,
            ],
            children: [
                {
                    key: '/category',
                    label: t('category'),
                    permissions: [PageAccessPermissionEnum.CATEGORY_MANAGEMENT],
                    onClick: () => handleClick("/category"),
                },
                {
                    key: '/modifier',
                    label: t('modifier'),
                    permissions: [PageAccessPermissionEnum.MODIFIER_MANAGEMENT],
                    onClick: () => handleClick("/modifier"),
                },
            ]
        },
        {
            key: 'sales',
            label: t('sales'),
            icon: <BarChartOutlined />,
            permissions: [
                PageAccessPermissionEnum.GRATUITY_MANAGEMENT,
                PageAccessPermissionEnum.SALES_TYPE_MANAGEMENT,
                PageAccessPermissionEnum.TAX_MANAGEMENT,
            ],
            children: [
                {
                    key: '/sales-type',
                    label: t('salesType'),
                    permissions: [PageAccessPermissionEnum.SALES_TYPE_MANAGEMENT],
                    onClick: () => handleClick("/sales-type"),
                },
                {
                    key: '/gratuity',
                    label: t('gratuity'),
                    permissions: [PageAccessPermissionEnum.GRATUITY_MANAGEMENT],
                    onClick: () => handleClick("/gratuity"),
                },
                {
                    key: '/tax',
                    label: t('taxes'),
                    permissions: [PageAccessPermissionEnum.TAX_MANAGEMENT],
                    onClick: () => handleClick("/tax"),
                },
            ],
        },
        {
            key: 'tableManagement',
            label: t('tableManagement'),
            icon: <LayoutOutlined />,
            permissions: [
                PageAccessPermissionEnum.TABLE_MANAGEMENT,
            ],
            children: [
                {
                    key: '/table',
                    label: t('table'),
                    permissions: [PageAccessPermissionEnum.TABLE_MANAGEMENT],
                    onClick: () => handleClick("/table"),
                },
                {
                    key: '/table-group',
                    label: t('tableGroup'),
                    permissions: [PageAccessPermissionEnum.TABLE_MANAGEMENT],
                    onClick: () => handleClick("/table-group"),
                },
            ]
        },
        {
            key: 'accountSettings',
            label: t('accountSettings'),
            icon: <UserSwitchOutlined />,
            permissions: [
                PageAccessPermissionEnum.ACCOUNT_MANAGEMENT,
                PageAccessPermissionEnum.ROLE_MANAGEMENT,
            ],
            children: [
                {
                    key: '/account-management',
                    label: t('accountManagement'),
                    permissions: [PageAccessPermissionEnum.ACCOUNT_MANAGEMENT],
                    onClick: () => handleClick("/account-management"),
                },
                {
                    key: '/role-management',
                    label: t('role'),
                    permissions: [PageAccessPermissionEnum.ROLE_MANAGEMENT],
                    onClick: () => handleClick("/role-management"),
                },
            ],
        },
        {
            key: 'config',
            label: t('configuration'),
            icon: <ToolOutlined />,
            permissions: [
                PageAccessPermissionEnum.ORGANIZATION_SETTINGS,
                PageAccessPermissionEnum.OUTLET_MANAGEMENT,
            ],
            children: [
                {
                    key: '/outlet',
                    label: t('outlet'),
                    permissions: [PageAccessPermissionEnum.OUTLET_MANAGEMENT],
                    onClick: () => handleClick("/outlet")
                },
                {
                    key: '/organization-settings',
                    label: t('organization'),
                    permissions: [PageAccessPermissionEnum.ORGANIZATION_SETTINGS],
                    onClick: () => handleClick("/organization-settings"),
                },
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