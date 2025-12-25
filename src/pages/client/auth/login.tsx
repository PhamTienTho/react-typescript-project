import { App, Button, Divider, Form, FormProps, Input } from "antd";
import { useState } from "react";
import './login.scss';
import { Link, useNavigate } from "react-router-dom";
import { loginAPI } from "@/services/api";

interface FieldType {
    email: string;
    password: string;
}

const LoginPage = () => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const {message} = App.useApp();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const {email, password} = values;
        setIsLoading(true);
        const res = await loginAPI(email, password);
        if(res.data) {
            localStorage.setItem("access_token", res.data.access_token);
            message.success("Đăng nhập thành công");
            navigate('/');
        }
        else {
            message.error(res.message);
        }
        setIsLoading(false);
    };
    return (
        <div className="login-page">
            <main className="main">
                <div className="container">
                    <section className="wrapper">
                        <div className="heading">
                            <h2 style={{ textAlign: "center" }}>Đăng nhập</h2>
                            <Divider />
                        </div>
                        <Form
                            name="Đăng ký tài khoản"
                            onFinish={onFinish}
                            form={form}
                            layout="vertical"
                        >

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
                            <Form.Item label={null}>
                                <Button type="primary" onClick={() => form.submit()} loading={isLoading}>
                                    Submit
                                </Button>
                            </Form.Item>
                            <Divider>Hoặc</Divider>

                            <p style={{ textAlign: "center" }}>
                                Chưa có tài khoản ?
                                <span>
                                    <Link to='/register' > Đăng ký tài khoản </Link>
                                </span>
                            </p>
                        </Form >

                    </section>
                </div>
            </main>
        </div>
    )
}

export default LoginPage;