import { useEffect, useState } from "react";
import { SelectProps } from "antd";

import { outletApi } from "../../api";

import useStaticModal from "../useStaticModal";
import useNotification from "../useNotification";
import { useTranslation } from "react-i18next";



export function useTableGroupManagement() {

    const { t } = useTranslation(['global', 'table']);

    const { serverErrorModal, errorModal, confirmationModal } = useStaticModal();
    const { successnotification } = useNotification();

    const [contentLoad, setContentLoad] = useState<boolean>(true);
    const [outletSelection, setOutletSelection] = useState<SelectProps['options']>([]);
    const [selectedOutlet, setSelectedOutlet] = useState<string>("");

    useEffect(() => {
        getOutletList();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (selectedOutlet === "") return;
        getTableGroupData();
    }, [selectedOutlet]);

    const statusOptions : SelectProps['options'] = [
        {
            label : t("global:active"),
            value : 1
        },
        {
            label : t("global:inactive"),
            value : 0
        },
    ];

    const getOutletList = async () : Promise<void> => {

        try {
            const [err, data] = await outletApi.getAllOutlet();

            if (err) {
                serverErrorModal();
                return;
            }

            const activeOptions = data
                .filter((item: any) => item.status === true)
                .map((item: any) => ({
                    label: item.outletName,
                    value: item.outletId,
                }));

            const inactiveOptions = data
                .filter((item: any) => item.status === false)
                .map((item: any) => ({
                    label: item.outletName,
                    value: item.outletId,
                }));

            const groupedOptions: SelectProps['options'] = [
                {
                    label: t("global:active"),
                    title: t("global:active"),
                    options: activeOptions,
                },
                {
                    label: t("global:inactive"),
                    title: t("global:inactive"),
                    options: inactiveOptions,
                },
            ];

            setOutletSelection(groupedOptions);

            const firstOption = activeOptions[0]?.value ?? inactiveOptions[0]?.value;
            if (firstOption) setSelectedOutlet(firstOption);

        } finally {
            setContentLoad(false);
        }
    }

    const getTableGroupData = () => {
        console.log(selectedOutlet);
    }

    const handleChangeOutlet = async (outletId : string) : Promise<void> => {
        setSelectedOutlet(outletId);
    }

    return {
        contentLoad,
        outletSelection,
        selectedOutlet,
        statusOptions,
        handleChangeOutlet,
    }
}