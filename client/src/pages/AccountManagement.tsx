
import { Typography, Input, Button, Select, Table, Skeleton } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import useAccountManagement from '../hooks/accounts/useAccountManagement';

// types and interfaces
import { AccountTableData } from '../hooks/accounts/useAccountManagement';

const { Title } = Typography;
const { Search } = Input;


export default function AccountManagement() {

    const {
        roleOptions,
        contentLoad,
        columns,
        accounts,
        handleChangeRoleFilter,
        handleSearch
    } = useAccountManagement();

    return (
        <div>
            <Title level={3}>Account</Title>
            {contentLoad ? (
                <div style={styles.controlSection}>
                    <div style={styles.skeletonInput}>
                        <Skeleton.Input active size="large" block />
                    </div>

                    <div style={styles.rightSide}>
                        <Skeleton.Input active size="large" style={styles.selectionInput}/>
                        <Skeleton.Button active size="large" style={styles.skeletonbtn}/>
                    </div>
                </div>    
            ) : (
                <div style={styles.controlSection}>
                    <Search
                        style={styles.searchInput}
                        size='large'
                        allowClear
                        placeholder='Find Username/Name/Email'
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <div style={styles.rightSide}>
                        <Select
                            style={styles.selectionInput}
                            size='large'
                            placeholder='Select Role'
                            mode="multiple"
                            allowClear
                            options={roleOptions}
                            onChange={handleChangeRoleFilter}
                            filterOption={(input, option) =>
                                (option?.label as string).toLowerCase().includes(input.toLowerCase())
                            }
                        />
                        <Button
                            type="primary"
                            size='large'
                            icon={<PlusOutlined />}
                        >
                            New Account
                        </Button>
                    </div>
                </div>
            )}
            <Table<AccountTableData> columns={columns} dataSource={accounts} size='middle' loading={contentLoad} />
        </div>
    )
}

const styles : { [key: string]: React.CSSProperties } = {
    controlSection : {
        width: '100%',
        marginTop: '3rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    searchInput : {
        maxWidth: '40%',
        // width: '350px'
    },
    rightSide : {
        display: 'flex',
        alignItems: 'center'
    },
    selectionInput : {
        width: '350px',
        margin: '0px 1rem'
    },
    skeletonbtn : {
        width: '140px'
    },
    skeletonInput : {
        minWidth: '40%'
    }
}