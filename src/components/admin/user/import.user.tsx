import { InboxOutlined } from "@ant-design/icons";
import { Divider, message, Modal, notification, Table, Upload, UploadProps } from "antd";
import { TableProps } from "antd/lib";
import { useState } from "react";
import Exceljs from 'exceljs';
import { bulkCreateUserAPI } from "@/services/api";
import templateFile from "assets/template/user.xlsx?url";

interface IProps {
    openImportUser: boolean;
    setOpenImportUser: (v: boolean) => void;
    refreshTable: () => void;
}

interface DataType {
    fullName: string;
    email: string;
    phone: string;
}

const columns: TableProps<DataType>['columns'] = [
    {
        title: 'Name',
        dataIndex: 'fullName',
    },
    {
        title: 'Email',
        dataIndex: 'email',
    },
    {
        title: 'Phone number',
        dataIndex: 'phone',
    },
];



const ImportUserModal = (props: IProps) => {
    const { openImportUser, setOpenImportUser, refreshTable } = props;
    const { Dragger } = Upload;
    const [dataImport, setDataImport] = useState<DataType[]>([]);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const propsUpload: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        customRequest({ file, onSuccess }) {
            setTimeout(() => {
                if (onSuccess) onSuccess("ok");
            }, 0);
        },
        async onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                // console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                // console.log(info);
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj!;

                    // load file to buffer
                    const arrayBuffer = await file.arrayBuffer();
                    const workbook = new Exceljs.Workbook();
                    await workbook.xlsx.load(arrayBuffer);

                    // convert file to json
                    let jsonData : DataType[] = [];
                    workbook.worksheets.forEach(function (sheet) {
                        // read first row as data keys
                        let firstRow = sheet.getRow(1);
                        if (!firstRow.cellCount) return;
                        let keys = firstRow.values as any[];
                        sheet.eachRow((row, rowNumber) => {
                            if (rowNumber == 1) return;
                            let values = row.values as any;
                            let obj: any = {};
                            for (let i = 1; i < keys.length; i++) {
                                obj[keys[i]] = values[i];
                                obj.id=i;
                            }
                            jsonData.push(obj);
                        })
                    });
                    jsonData = jsonData.map((item, index) => {
                        return {...item, id: index+1}
                    })
                    setDataImport(jsonData);
                }
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const handleImport = async () => {
        setIsSubmit(true);
        const dataSubmit = dataImport.map(item => ({
            fullName: item.fullName,
            email: item.email,
            phone: item.phone,
            password: import.meta.env.VITE_USER_CREATE_DEFAULT_PASSWORD
        }))
        const res = await bulkCreateUserAPI(dataSubmit);
        if(res.data) {
            notification.success({
                message: "Bulk Create Users",
                description: `Success: ${res.data.countSuccess}. Error: ${res.data.countError}`
            })
        }
        setIsSubmit(false);
        setOpenImportUser(false);
        setDataImport([]);
        refreshTable();
    }
    return (
        <Modal
            title="Import data user"
            open={openImportUser}
            onOk={() => handleImport()}
            // confirmLoading={confirmLoading}
            onCancel={() => {
                setOpenImportUser(false);
                setDataImport([]);
            }}
            okButtonProps={{
                disabled: dataImport.length > 0 ? false : true,
                loading: isSubmit
            }}
            width={700}
            destroyOnClose={true}
            maskClosable={false}
        >
            <Dragger {...propsUpload}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single upload. Only accept .csv .xls .xlsx
                </p>
                <a href={templateFile} download onClick={e => e.stopPropagation()}>Download sample file</a>
            </Dragger>
            <Divider />
            <Table<DataType> 
                dataSource={dataImport}
                columns={columns} 
                rowKey={"id"}
                />
        </Modal>
    )
}

export default ImportUserModal;