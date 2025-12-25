import { App, Button, Divider, Form, FormProps, Input } from "antd";
import { useState } from "react";
import './register.scss';
import { Link, useNavigate } from "react-router-dom";
import { registerAPI } from "@/services/api";

type FieldType = {
    fullName: string;
    email: string;
    password: string;
    phone: string;
};

const RegisterPage = () => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { message } = App.useApp();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsLoading(true);
        const { email, fullName, password, phone } = values;
        const res = await registerAPI(fullName, email, password, phone)
        if (res.data) {
            message.success("Đăng ký thành công");
            navigate('/login');
        }
        else {
            message.error(res.message);
        }
        setIsLoading(false);
    };

    return (

        <div className="register-page">
            <main className="main">
                <div className="container">
                    <section className="wrapper">
                        <div className="heading">
                            <h2 style={{textAlign: "center"}}>Đăng Ký Tài Khoản</h2>
                            <Divider />
                        </div>
                        <Form
                            name="Đăng ký tài khoản"
                            onFinish={onFinish}
                            form={form}
                            layout="vertical"
                        >
                            <Form.Item<FieldType>
                                label="Họ tên"
                                name="fullName"
                                rules={[{ required: true, message: 'Họ tên không được để trống' }]}
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
                                label="Số điện thoại"
                                name="phone"
                                rules={[{ required: true, message: 'Số điện thoại không được để trống' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item label={null}>
                                <Button type="primary" onClick={() => form.submit()} loading={isLoading}>
                                    Submit
                                </Button>
                            </Form.Item>

                            <Divider>Hoặc</Divider>

                            <p className="text text-normal" style={{ textAlign: "center" }}>
                                Đã có tài khoản ?
                                <span>
                                    <Link to='/login' > Đăng Nhập </Link>
                                </span>
                            </p>

                        </Form >
                    </section>
                </div>
            </main>
        </div>


    )
}

export default RegisterPage;