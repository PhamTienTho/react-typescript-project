import { App, Input, Modal } from "antd";
import { useState } from "react";
import { Form } from "antd";
import { createUserAPI } from "@/services/api";
import { ActionType } from "@ant-design/pro-components";

interface IProps {
    openCreateUser: boolean;
    setOpenCreateUser: (v: boolean) => void;
    refreshTable: () => void
}

type FieldType = {
    fullName: string;
    password: string;
    email: string;
    phone: string
}

const CreateUserModal = (props: IProps) => {
    const { openCreateUser, setOpenCreateUser, refreshTable } = props;
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form] = Form.useForm();
    const { message } = App.useApp();

    const handleOnFinish = async (value: FieldType) => {
        setConfirmLoading(true);
        const res = await createUserAPI(value.fullName, value.password, value.email, value.phone);
        setTimeout(() => {
            setConfirmLoading(false);
        }, 1000);
        if (res.data) {
            message.success("Thêm user thành công");
            form.resetFields();
            refreshTable();
            setOpenCreateUser(false);
        }
        else {
            message.error(res.message);
        }
    }

    return (
        <Modal
            title="Add new user"
            open={openCreateUser}
            onOk={() => {
                form.submit();
            }}
            confirmLoading={confirmLoading}
            onCancel={() => {
                setOpenCreateUser(false);
                form.resetFields();
            }}
        >
            <Form
                name=""
                onFinish={handleOnFinish}
                form={form}
                layout="vertical"
            >
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
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Email không được để trống' },
                        { type: "email", message: 'Email không đúng định dạng' }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Mật khẩu không được để trống' }]}
                >
                    <Input.Password />
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

export default CreateUserModal;