
import { useNavigate } from 'react-router-dom';
import useStaticModal from '../useStaticModal';
import { useTranslation } from 'react-i18next';

// redux
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

export default function useChangePassword() {

    const navigate = useNavigate();
    const { confirmationModal } = useStaticModal();

    const { t } = useTranslation(["account", "global"]);

    const userInfo = useSelector((state : RootState) => state.userInfo);

    const handleClickBack = () => {
        confirmationModal({
            title : t("global:exitPage"),
            content: t("account:passwordNotChanged"),
            onOk : () => navigate(-1)
        });
    }

    const handleSubmit = () => {

    }

    return {
        userInfo,
        handleSubmit,
        handleClickBack,
    }
}