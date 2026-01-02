import { getUserAPI } from '@/services/api';
import { dateRangeValidate } from '@/services/helper';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useState } from 'react';
import { IoCloudUploadOutline } from 'react-icons/io5';


type TSearch = {
    fullName: string;
    email: string;
    createdAt: string;
    createdAtRange: string
}

interface IProps {
    setOpenUserDetail: (v: boolean) => void;
    setUserDetail: (v: IUserTable) => void;
    setOpenCreateUser: (v: boolean) => void;
    actionRef: React.MutableRefObject<ActionType | undefined>;
    setOpenImportUser:(v: boolean) => void;
}

const TableUser = (props: IProps) => {
    const { setOpenUserDetail, setUserDetail, setOpenCreateUser, actionRef, setOpenImportUser } = props;
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });

    const columns: ProColumns<IUserTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'ID',
            dataIndex: '_id',
            onFilter: false,
            hideInSearch: true,
            render: (_, entity) => {
                return (
                    <div>
                        <a href='#' onClick={() => {
                            setOpenUserDetail(true);
                            setUserDetail(entity)
                        }}>{entity._id}</a>
                    </div>)
            }
        },
        {
            title: 'Full name',
            dataIndex: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            copyable: true
        },
        {
            title: 'Created at',
            dataIndex: 'createdAt',
            hideInSearch: true,
            sorter: true,
            valueType: 'date',
        },
        {
            title: 'Created at',
            dataIndex: 'createdAtRange',
            valueType: 'dateRange',
            hideInTable: true
        },
        {
            title: 'Action',
            render: () => {
                return (
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <EditOutlined style={{ color: 'orange', cursor: 'pointer' }} />
                        <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
                    </div>
                )
            },
            hideInSearch: true
        }
    ];

    return (
        <>
            <ProTable<IUserTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    let query = '';
                    console.log(sort, filter);
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`;
                        if (params.email) {
                            query += `&email=/${params.email}/i`;
                        }
                        if (params.fullName) {
                            query += `&fullName=/${params.fullName}/i`;
                        }
                        const createDateRange = dateRangeValidate(params.createdAtRange);
                        if (createDateRange) {
                            console.log(createDateRange);
                            query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`;
                        }
                    }

                    query += `&sort=-createdAt`;

                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`
                    } else query += `&sort=-createdAt`;

                    const res = await getUserAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta);
                    }
                    return {
                        data: res.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta.total
                    }

                }}
                rowKey="_id"
                pagination={{
                    showSizeChanger: true,
                    current: meta.current,
                    pageSize: meta.pageSize,
                    total: meta.total,
                    showTotal(total, range) {
                        return (<div>{range[0]} - {range[1]} trên {total}</div>)
                    },
                }}
                dateFormatter="string"
                headerTitle="Table user"
                toolBarRender={() => [
                    <>
                        <Button
                            key="button"
                            icon={<IoCloudUploadOutline />}
                            onClick={() => {
                                setOpenImportUser(true);
                            }}
                            type="dashed"
                        >
                            Import
                        </Button>
                        <Button
                            key="button"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                setOpenCreateUser(true);
                            }}
                            type="primary"
                        >
                            Add new user
                        </Button>
                    </>
                ]}

            />
        </>
    );
};

export default TableUser;