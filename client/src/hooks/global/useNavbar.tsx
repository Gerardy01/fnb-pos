

import {
    EditOutlined,
    LogoutOutlined,
} from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';
import useStaticModal from '../useStaticModal';

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
    const { serverErrorModal } = useStaticModal();

    const userInfo = useSelector((state : RootState) => state.userInfo);
    const organizationInfo = useSelector((state : RootState) => state.organizationInfo);

    const handleLogout = () : void => {
        authApi.logout().then(() => {
            dispatch(removeAccessToken());
            navigate("/login");
        }).catch(() => {
            serverErrorModal();
        });
    }

    const dropdownItems: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <a onClick={() => navigate("/dashboard/profile")}>
                    Profile
                </a>
            ),
            icon: <EditOutlined />
        },
        {
            key: '2',
            label: (
                <a onClick={handleLogout}>
                    logout
                </a>
            ),
            icon: <LogoutOutlined />
        },
    ];

    return {
        userInfo,
        organizationInfo,
        dropdownItems,
    }
}