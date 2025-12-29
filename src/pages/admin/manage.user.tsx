import UserDetail from "@/components/admin/user/detail.user";
import TableUser from "@/components/admin/user/table.user";
import { useState } from "react";

const ManageUserPage = () => {
    const [openUserDetail, setOpenUserDetail] = useState(false);
    const [userDetail, setUserDetail] = useState<IUserTable | null>(null)

    return (
        <>
            <TableUser
                setOpenUserDetail={setOpenUserDetail}
                setUserDetail={setUserDetail}
            />
            <UserDetail
                openUserDetail={openUserDetail}
                setOpenUserDetail={setOpenUserDetail}
                userDetail={userDetail}
                setUserDetail={setUserDetail}
            />
        </>
    )
}

export default ManageUserPage;