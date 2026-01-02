import { updateUserAPI } from "@/services/api";
import { Form, Input, message, Modal, notification } from "antd";
import { FormProps } from "antd/lib";
import { useEffect, useState } from "react";

type FieldType = {
    _id: string;
    email: string;
    fullName: string;
    phone: string
}

interface IProps {
    openUpdateUser: boolean;
    setOpenUpdateUser: (v: boolean) => void;
    dataUpdate: IUserTable | null;
    setDataUpdate: (v: IUserTable | null) => void;
    refreshTable: () => void;
}


const UpdateUserTable = (props: IProps) => {

    const { openUpdateUser, setOpenUpdateUser, dataUpdate, setDataUpdate, refreshTable } = props;
    const [form] = Form.useForm();
    const [confirmLoading, setConFirmLoading] = useState(false);

    useEffect(() => {
        form.setFieldsValue({
            _id: dataUpdate?._id,
            email: dataUpdate?.email,
            fullName: dataUpdate?.fullName,
            phone: dataUpdate?.phone
        })
    }, [dataUpdate]);

    const handleOnFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setConFirmLoading(true);
        const res = await updateUserAPI(values._id, values.fullName, values.phone);
        if(res.data){
            message.success("Cập nhật user thành công");
            setOpenUpdateUser(false);
            refreshTable();
            setDataUpdate(null);
        }
        else {
            notification.error({
                message: "Cập nhật user thất bại",
                description: res.message
            })
        }
        setConFirmLoading(false);
    }

    return (
        <Modal
            title="Update user"
            open={openUpdateUser}
            onOk={() => {
                form.submit();
            }}
            confirmLoading={confirmLoading}
            onCancel={() => {
                setOpenUpdateUser(false);
                setDataUpdate(null);
            }}
        >
            <Form
                name=""
                onFinish={handleOnFinish}
                form={form}
                layout="vertical"
            >
                <Form.Item<FieldType>
                    label="ID"
                    name="_id"
                >
                    <Input disabled={true} />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Email không được để trống' },
                        { type: "email", message: 'Email không đúng định dạng' }
                    ]}
                >
                    <Input disabled={true} />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Name"
                    name="fullName"
                    rules={[
                        { required: true, message: 'Tên không được để trống' },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Phone number"
                    name="phone"
                    rules={[
                        { required: true, message: 'Số điện thoại không được để trống' },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form >
        </Modal>
    )
}

export default UpdateUserTable;

