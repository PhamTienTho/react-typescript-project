import { InboxOutlined } from "@ant-design/icons";
import { Divider, message, Modal, Table, Upload, UploadProps } from "antd";
import { TableProps } from "antd/lib";
import { useState } from "react";
import Exceljs from 'exceljs';
import { Buffer } from 'buffer';

interface IProps {
    openImportUser: boolean;
    setOpenImportUser: (v: boolean) => void;
}

interface DataType {
    name: string;
    email: string;
    phone: string
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
    const { openImportUser, setOpenImportUser } = props;
    const { Dragger } = Upload;
    const [dataImport, setDataImport] = useState<DataType[]>([]);

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
                    const buffer = Buffer.from(arrayBuffer);
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
                            }
                            jsonData.push(obj);
                        })
                    });
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
    return (
        <Modal
            title="Import data user"
            open={openImportUser}
            onOk={() => {
                // form.submit();
            }}
            // confirmLoading={confirmLoading}
            onCancel={() => {
                setOpenImportUser(false);
                setDataImport([]);
            }}
            okButtonProps={{
                disabled: dataImport.length > 0 ? false : true
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
            </Dragger>
            <Divider />
            <Table<DataType> 
                dataSource={dataImport}
                columns={columns} />
        </Modal>
    )
}

export default ImportUserModal;