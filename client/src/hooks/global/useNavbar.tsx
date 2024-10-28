import { useEffect, useState } from 'react';

import {
    EditOutlined,
    LockOutlined,
    LogoutOutlined,
} from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useStaticModal from '../useStaticModal';

import { PageAccessPermissionEnum } from '../../utils/enums';

import { authApi } from '../../api';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { removeAccessToken } from '../../redux/authentication/tokenSlice';

// types and interfaces
import type { MenuProps } from 'antd';


export default function useNavbar() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { serverErrorModal, confirmationModal } = useStaticModal();

    const { t } = useTranslation(["account", "auth", "global"]);

    const userInfo = useSelector((state : RootState) => state.userInfo);
    const organizationInfo = useSelector((state : RootState) => state.organizationInfo);

    const [dropdownItems, setDropdownItems] = useState<MenuProps['items']>([]);

    useEffect(() => {
        checkPermission();
    }, []);

    const handleLogout = () : void => {
        authApi.logout().then(() => {
            dispatch(removeAccessToken());
            navigate("/login");
        }).catch(() => {
            serverErrorModal();
        });
    }

    const checkPermission = () => {
        const dropdownItemList : MenuProps['items']= [];
        if (userInfo.pageAccessPermissions.includes(PageAccessPermissionEnum.ACCOUNT_MANAGEMENT)) {
            dropdownItemList.push({
                key: '1',
                label: (
                    <a onClick={() => navigate("/dashboard/profile")}>
                        {t("global:profile")}
                    </a> 
                ),
                icon: <EditOutlined />
            });
        } else {
            dropdownItemList.push({
                key: '1',
                label: (
                    <a onClick={() => navigate("/dashboard/change-password")}>
                        {t("account:changePassword")}
                    </a> 
                ),
                icon: <LockOutlined />
            });
        }

        dropdownItemList.push({
            key: '2',
            label: (
                <a onClick={() => confirmationModal({
                    title: t("auth:confirmLogout"),
                    content: t("auth:sureLogout"),
                    okBtn: t("auth:logout"),
                    okBtnDanger: true,
                    onOk : handleLogout,
                    centered: true
                })}>
                    {t("auth:logout")}
                </a>
            ),
            icon: <LogoutOutlined />
        });

        setDropdownItems(dropdownItemList);
    }

    return {
        userInfo,
        organizationInfo,
        dropdownItems,
    }
}