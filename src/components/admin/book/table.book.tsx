import { getBookAPI } from "@/services/api";
import { PlusOutlined } from "@ant-design/icons";
import { ProColumns, ProTable } from "@ant-design/pro-components";
import { Button } from "antd";
import { useState } from "react";
import { CSVLink } from "react-csv";
import { TbFileExport } from "react-icons/tb";

type TSearch = {
    mainText: string;
    author: string;
}

interface IProps {
    setOpenBookDetail: (v: boolean) => void;
    bookDetail: IBookTable | null;
    setBookDetail: (v: IBookTable | null) => void;
}

const BookTable = (props: IProps) => {

    const { setOpenBookDetail, bookDetail, setBookDetail } = props;
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    })
    const [dataExport, setDataExport] = useState<IBookTable[]>([])

    const columns: ProColumns<IBookTable>[] = [
        {
            dataIndex: '_id',
            title: 'ID',
            hideInSearch: true,
            render: (_, entity) => {
                return (
                   <div>
                     <a
                        onClick={() => {
                            setOpenBookDetail(true);
                            setBookDetail(entity);
                            console.log(bookDetail);
                        }}
                    >{entity._id}</a>
                   </div>
                )
            }
        },
        {
            dataIndex: 'mainText',
            title: 'Title',
        },
        {
            dataIndex: 'category',
            title: 'Category',
            hideInSearch: true,
        },
        {
            dataIndex: 'author',
            title: 'Author',
        },
        {
            dataIndex: 'price',
            title: 'Price',
            hideInSearch: true,
            sorter: true,
            render: (_, entity) => {
                return (
                    entity.price.toLocaleString('it-IT', { style: 'decimal', currency: 'VND' })
                )
            }
        },
        {
            dataIndex: 'updatedAt',
            title: 'Updated at',
            hideInSearch: true,
            valueType: 'date'
        },
        {
            title: 'Action',
            hideInSearch: true,
        },
    ]
    return (
        <ProTable<IBookTable, TSearch>
            columns={columns}
            // actionRef={actionRef}
            cardBordered
            request={async (params, sort, filter) => {
                let query = '';
                if (params) {
                    query += `?current=${params.current}&pageSize=${params.pageSize}`;
                    if (params.mainText) {
                        query += `&mainText=/${params.mainText}/i`;
                    }
                    if (params.author) {
                        query += `&author=/${params.author}/i`;
                    }
                }

                if (sort && sort.price) {
                    query += `&sort=${sort.price === "ascend" ? "price" : "-price"}`;
                }

                console.log(query);
                const res = await getBookAPI(query);
                if (res.data) {
                    setMeta(res.data.meta);
                    setDataExport(res.data.result);
                }
                return ({
                    data: res.data?.result,
                    success: true,

                })
            }}
            editable={{
                type: 'multiple',
            }}
            rowKey="_id"

            pagination={{
                pageSize: meta.pageSize,
                total: meta.total,
                current: meta.current,
                showSizeChanger: true,
            }}
            dateFormatter="string"
            headerTitle="Book Tables"
            toolBarRender={() => [
                <Button
                    key="button"
                    icon={<TbFileExport />}
                    type="dashed"
                >
                    <CSVLink data={dataExport} filename='export-book.csv'>Export</CSVLink>
                </Button>,
                <Button
                    key="button"
                    icon={<PlusOutlined />}
                    type="primary"
                >
                    Add new book
                </Button>,
            ]}
        />
    )
}

export default BookTable;