import { deleteUser, getUserAPI } from '@/services/api';
import { dateRangeValidate } from '@/services/helper';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, message, notification, Popconfirm } from 'antd';
import { useState } from 'react';
import { CSVLink } from 'react-csv';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { TbFileExport } from 'react-icons/tb';
import UpdateUserTable from './update.user';
import { PopconfirmProps } from 'antd/lib';


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
    setOpenImportUser: (v: boolean) => void;
    refreshTable: () => void;
}

const TableUser = (props: IProps) => {
    const { setOpenUserDetail, setUserDetail, setOpenCreateUser, actionRef, setOpenImportUser, refreshTable } = props;
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });
    const [dataExport, setDataExport] = useState<IUserTable[]>([]);
    const [openUpdateUser, setOpenUpdateUser] = useState(false);
    const [dataUpdate, setDataUpdate] = useState<IUserTable | null>(null);

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
            render: (_, entity) => {
                return (
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <EditOutlined style={{ color: 'orange', cursor: 'pointer' }}
                            onClick={() => {
                                setDataUpdate(entity);
                                setOpenUpdateUser(true);
                            }}
                        />
                        <>
                            <Popconfirm
                                title="Delete user"
                                description="Are you sure to delete this user?"
                                onConfirm={() => confirmDeleteUser(entity._id)}
                                onCancel={() => {}}
                                okText="Yes"
                                cancelText="No"
                                placement='left'
                            >
                                <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
                            </Popconfirm>
                        </>
                    </div>
                )
            },
            hideInSearch: true
        }
    ];

    const confirmDeleteUser = async (_id: string) => {
        const res = await deleteUser(_id);
        if(res.data) {
            message.success("Xóa user thành công");
            refreshTable();
        }else {
            notification.error({
                message: "Xóa user thất bại",
                description: res.message
            })
        }
    };

    return (
        <>
            <ProTable<IUserTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    let query = '';
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
                        setDataExport(res.data.result);
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
                            icon={<TbFileExport />}
                            type="dashed"
                        >
                            <CSVLink data={dataExport} filename='export-user.csv'>Export</CSVLink>
                        </Button>
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
            <UpdateUserTable
                openUpdateUser={openUpdateUser}
                setOpenUpdateUser={setOpenUpdateUser}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                refreshTable={refreshTable}
            />
        </>
    );
};

export default TableUser;