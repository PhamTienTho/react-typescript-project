import { useCurrentApp } from "@/components/context/app.context";
import { Button, Result } from "antd";
import { useLocation } from "react-router-dom";

type TProps = {
    children: React.ReactNode;
}

const ProtectedRoute = (props: TProps) => {

    const { user, isAuthenticated } = useCurrentApp();
    const location = useLocation();

    if (isAuthenticated === false) {
        return (
            <Result
                status="404"
                title="404"
                subTitle="Bạn cần đăng nhập để truy cập"
                extra={<Button type="primary" href="/">Back Home</Button>}
            />
        )
    }
    const isAdminRoute = location.pathname.includes('admin');
    if(isAuthenticated === true && isAdminRoute) {
        if(user?.role === 'USER') {
            return (
                <Result
                    status="403"
                    title="403"
                    subTitle="Bạn cần đăng nhập bằng tài khoản admin để truy cập"
                    extra={<Button type="primary" href="/">Back Home</Button>}
                />
            )
        }
    }
    return (
        <>
            {props.children}
        </>
    )
}

export default ProtectedRoute;