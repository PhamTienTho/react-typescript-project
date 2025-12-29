import CreateUserModal from "@/components/admin/user/create.user";
import UserDetail from "@/components/admin/user/detail.user";
import TableUser from "@/components/admin/user/table.user";
import { ActionType } from "@ant-design/pro-components";
import { useRef, useState } from "react";

const ManageUserPage = () => {
    const [openUserDetail, setOpenUserDetail] = useState(false);
    const [userDetail, setUserDetail] = useState<IUserTable | null>(null)
    const [openCreateUser, setOpenCreateUser] = useState(false);
    const actionRef = useRef<ActionType>();
    return (
        <>
            <TableUser
                setOpenUserDetail={setOpenUserDetail}
                setUserDetail={setUserDetail}
                setOpenCreateUser={setOpenCreateUser}
                actionRef={actionRef}
            />
            <UserDetail
                openUserDetail={openUserDetail}
                setOpenUserDetail={setOpenUserDetail}
                userDetail={userDetail}
                setUserDetail={setUserDetail}
            />
            <CreateUserModal
                openCreateUser={openCreateUser}
                setOpenCreateUser={setOpenCreateUser}
                actionRef={actionRef}
            />
        </>
    )
}

export default ManageUserPage;