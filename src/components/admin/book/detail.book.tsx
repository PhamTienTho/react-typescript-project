import { FORMATE_DATE } from "@/services/helper";
import { Badge, Descriptions, Divider, Drawer, GetProp, Image, Upload, UploadFile, UploadProps } from "antd"
import { DescriptionsProps } from "antd/lib";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

interface IProps {
    openBookDetail: boolean;
    setOpenBookDetail: (v: boolean) => void;
    bookDetail: IBookTable | null;
    setBookDetail: (v: IBookTable | null) => void;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const BookDetail = (props: IProps) => {

    const { openBookDetail, setOpenBookDetail, bookDetail, setBookDetail } = props;
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'ID',
            children: bookDetail?._id,
            span: 1.5
        },
        {
            key: '2',
            label: 'Title',
            children: bookDetail?.mainText,
            span: 1.5
        },
        {
            key: '3',
            label: 'Author',
            children: bookDetail?.author,
            span: 1.5
        },
        {
            key: '4',
            label: 'Price',
            children: bookDetail?.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }),
            span: 1.5
        },
        {
            key: '5',
            label: 'Category',
            children: <Badge status="processing" text={bookDetail?.category} />,
            span: 3
        },
        {
            key: '6',
            label: 'Created At',
            children: dayjs(bookDetail?.createdAt).format(FORMATE_DATE),
            span: 1.5
        },
        {
            key: '7',
            label: 'Updated At',
            children: dayjs(bookDetail?.updatedAt).format(FORMATE_DATE),
            span: 1.5
        },
    ]

    useEffect(() => {
        let imgThumbnail: any = {};
        let imgSlider: UploadFile[] = [];

        if (bookDetail?.thumbnail) {
            imgThumbnail = {
                uid: uuidv4(),
                name: bookDetail.thumbnail,
                status: 'done',
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${bookDetail.thumbnail}`
            }
        }
        if (bookDetail?.slider && bookDetail.slider.length > 0) {
            bookDetail.slider.map(item => {
                imgSlider.push({
                    uid: uuidv4(),
                    name: item,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`
                })
            })
        }
        setFileList([imgThumbnail, ...imgSlider]);
    }, [bookDetail]);

    const handlePreview = async (file: UploadFile) => {

        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    return (
        <>
            <Drawer
                title="Book Detail"
                closable={{ 'aria-label': 'Close Button' }}
                onClose={() => {
                    setOpenBookDetail(false);
                    setBookDetail(null);
                }}
                open={openBookDetail}
                size='large'
            >
                <Descriptions bordered items={items} />
                <>
                    <Divider orientation="left">Image</Divider>
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        showUploadList={
                            {
                                showRemoveIcon: false
                            }
                        }
                    ></Upload>
                    {previewImage && (
                        <Image
                            style={{ display: "none" }}
                            preview={{
                                visible: previewOpen,
                                onVisibleChange: ((visible) => {
                                    console.log(visible);
                                    setPreviewOpen(visible)
                                })
                            }}
                            src={previewImage}
                        />
                    )}
                </>
            </Drawer>

        </>
    )
}

export default BookDetail;