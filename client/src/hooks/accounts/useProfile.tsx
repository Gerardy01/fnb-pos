

// redux
import { useSelector } from "react-redux"
import { RootState } from "../../redux/store"
import { useState } from "react";

// types and interfaces
export type ChangeNmaeForm = {
    name : string;
}

export default function useProfile() {

    const [openChangeNameModal, setOpenChangeNameModal] = useState<boolean>(false);

    const userInfo = useSelector((state : RootState) => state.userInfo);

    const handleOpenChangeName = (open : boolean) : void => {
        setOpenChangeNameModal(open);
    }

    const handleChangeName = (data : ChangeNmaeForm) : void => {
        if (data.name === userInfo.name) {
            setOpenChangeNameModal(false);
            return;
        }

        console.log(data.name)
    }

    return {
        userInfo,
        openChangeNameModal,
        handleOpenChangeName,
        handleChangeName
    }
}