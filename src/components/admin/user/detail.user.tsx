import { FORMATE_DATE } from "@/services/helper";
import { Badge, Descriptions, Drawer } from "antd"
import { DescriptionsProps } from "antd/lib";
import dayjs from "dayjs";
import { useState } from "react";

interface IProps {
    openUserDetail: boolean;
    setOpenUserDetail: (v: boolean) => void;
    userDetail: IUserTable | null;
    setUserDetail: (v: IUserTable | null) => void;
}

const UserDetail = (props: IProps) => {

    const { openUserDetail, setOpenUserDetail, userDetail, setUserDetail } = props;

    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'ID',
            children: userDetail?._id,
            span: 1.5
        },
        {
            key: '1',
            label: 'Name',
            children: userDetail?.fullName,
            span: 1.5
        },
        {
            key: '1',
            label: 'Email',
            children: userDetail?.email,
            span: 1.5
        },
        {
            key: '1',
            label: 'Phone number',
            children: userDetail?.phone,
            span: 1.5
        },
        {
            key: '1',
            label: 'Role',
            children:  <Badge status="processing" text={userDetail?.role} />,
            span: 3
        },
        {
            key: '1',
            label: 'Created At',
            children: dayjs(userDetail?.createdAt).format(FORMATE_DATE),
            span: 1.5
        },
        {
            key: '1',
            label: 'Updated At',
            children: dayjs(userDetail?.updatedAt).format(FORMATE_DATE),
            span: 1.5
        },
    ]
    return (
        <>
            <Drawer
                title="Basic Drawer"
                closable={{ 'aria-label': 'Close Button' }}
                onClose={() => {
                    setOpenUserDetail(false);
                    setUserDetail(null);
                }}
                open={openUserDetail}
                size='large'
            >
                <Descriptions title="User Info" bordered items={items} />
            </Drawer>
        </>
    )
}

export default UserDetail;