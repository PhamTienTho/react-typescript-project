import { FORMATE_DATE } from "@/services/helper";
import { Avatar, Badge, Descriptions, Drawer } from "antd"
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
    const avatarURL = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${userDetail?.avatar}`
    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'ID',
            children: userDetail?._id,
            span: 1.5
        },
        {
            key: '2',
            label: 'Name',
            children: userDetail?.fullName,
            span: 1.5
        },
        {
            key: '3',
            label: 'Email',
            children: userDetail?.email,
            span: 1.5
        },
        {
            key: '4',
            label: 'Phone number',
            children: userDetail?.phone,
            span: 1.5
        },
        {
            key: '5',
            label: 'Role',
            children: <Badge status="processing" text={userDetail?.role} />,
            span: 1.5
        },
        {
            key: '6',
            label: 'Avatar',
            children: <Avatar size={40} src={avatarURL}></Avatar>,
            span: 1.5
        },
        {
            key: '7',
            label: 'Created At',
            children: dayjs(userDetail?.createdAt).format(FORMATE_DATE),
            span: 1.5
        },
        {
            key: '8',
            label: 'Updated At',
            children: dayjs(userDetail?.updatedAt).format(FORMATE_DATE),
            span: 1.5
        },
    ]
    return (
        <>
            <Drawer
                title="User Detail"
                closable={{ 'aria-label': 'Close Button' }}
                onClose={() => {
                    setOpenUserDetail(false);
                    setUserDetail(null);
                }}
                open={openUserDetail}
                size='large'
            >
                <Descriptions bordered items={items} />
            </Drawer>
        </>
    )
}

export default UserDetail;