import CreateUserModal from "@/components/admin/user/create.user";
import UserDetail from "@/components/admin/user/detail.user";
import ImportUserModal from "@/components/admin/user/import.user";
import TableUser from "@/components/admin/user/table.user";
import { ActionType } from "@ant-design/pro-components";
import { useRef, useState } from "react";

const ManageUserPage = () => {
    const [openUserDetail, setOpenUserDetail] = useState(false);
    const [userDetail, setUserDetail] = useState<IUserTable | null>(null)
    const [openCreateUser, setOpenCreateUser] = useState(false);
    const [openImportUser, setOpenImportUser] = useState(false);
    const actionRef = useRef<ActionType>();

    const refreshTable = () => {
        actionRef.current?.reload();
    }
    return (
        <>
            <TableUser
                setOpenUserDetail={setOpenUserDetail}
                setUserDetail={setUserDetail}
                setOpenCreateUser={setOpenCreateUser}
                actionRef={actionRef}
                setOpenImportUser={setOpenImportUser}
                refreshTable={refreshTable}
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
                refreshTable={refreshTable}
            />
            <ImportUserModal
                openImportUser={openImportUser}
                setOpenImportUser={setOpenImportUser}
                refreshTable={refreshTable}
            />
        </>
    )
}

export default ManageUserPage;