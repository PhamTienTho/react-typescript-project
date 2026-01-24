import { createBookAPI, getCategoryAPI, uploadImageAPI } from "@/services/api";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, FormProps, GetProp, Image, Input, InputNumber, message, Modal, Select, Upload, UploadFile, UploadProps } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import { InputNumberProps } from "antd/lib";
import { useEffect, useState } from "react";
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';

type FieldType = {
    mainText: string;
    author: string;
    price: number;
    category: string;
    quantity: number;
    thumbnail: UploadFile[];
    slider: UploadFile[];
};

interface IProps {
    openCreateBook: boolean;
    setOpenCreateBook: (v: boolean) => void;
    refreshTable: () => void;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface IOption {
    value: string;
    label: string;
}

const formatter: InputNumberProps<number>['formatter'] = (value) => {
    const [start, end] = `${value}`.split('.') || [];
    const v = `${start}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${end ? `${v}.${end}` : `${v}`}`;
};

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const CreateBookModal = (props: IProps) => {
    const { openCreateBook, setOpenCreateBook, refreshTable } = props;
    const [categoryOption, setCategoryOption] = useState<IOption[]>([]);
    const [form] = Form.useForm();
    const [previewImage, setPreviewImage] = useState("");
    const [previewOpen, setPreviewOpen] = useState(false);
    const [loadingThumbnail, setLoadingThumbnail] = useState(false);
    const [loadingSlider, setLoadingSlider] = useState(false);
    const [thumbnailList, setThumbnailList] = useState<UploadFile[]>([]);
    const [sliderList, setSliderList] = useState<UploadFile[]>([]);

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    useEffect(() => {
        async function func() {
            const res = await getCategoryAPI();
            const category = res.data!.map(item => {
                return {
                    value: item,
                    label: item
                }
            });
            setCategoryOption(category);
        }
        func();
    }, [])


    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {

            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M || Upload.LIST_IGNORE;
    }

    const handleChangeUploadFile = (info: UploadChangeParam, type: 'thumbnail' | 'slider') => {
        if (info.file.status === 'uploading') {
            type === 'thumbnail' ? setLoadingThumbnail(true) : setLoadingSlider(true);
            return;
        }

        console.log(info.file);

        if (info.file.status === 'removed') {
             // Xử lý khi xóa ảnh
            if (type === 'thumbnail') {
                setThumbnailList([]);
                form.setFieldValue('thumbnail', []); // Reset Form
            } else {
                setSliderList(info.fileList);
                form.setFieldValue('slider', info.fileList); // Sync Form
            }
        }
    }

    const handleUploadFile = async (options: RcCustomRequestOptions, type: string) => {
        const { onSuccess, onError, file } = options;
        const imgFile = file as UploadFile;

        try {
            const res = await uploadImageAPI(imgFile, 'book');
            if (res && res.data) {
                // Tạo object file hoàn chỉnh
                const newFile: UploadFile = {
                    uid: imgFile.uid,
                    name: res.data.fileUploaded,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${res.data.fileUploaded}`
                };

                // Cập nhật State và Form thủ công
                if (type === 'thumbnail') {
                    setThumbnailList([newFile]);
                    form.setFieldValue('thumbnail', [newFile]);
                } else {
                    setSliderList((prev) => [...prev, newFile]);
                    // Lấy giá trị cũ của form để append thêm
                    const prevSlider = form.getFieldValue('slider') || [];
                    form.setFieldValue('slider', [...prevSlider, newFile]);
                }

                // Tắt loading ngay lập tức
                if (type === 'thumbnail') setLoadingThumbnail(false);
                else setLoadingSlider(false);

                if (onSuccess) onSuccess('ok');
            } else {
                message.error(res.message);
                if (type === 'thumbnail') setLoadingThumbnail(false);
                else setLoadingSlider(false);
            }
        } catch (error) {
            message.error("Upload failed");
            if (type === 'thumbnail') setLoadingThumbnail(false);
            else setLoadingSlider(false);
        }
    };

    const handleOnFinishForm:FormProps<FieldType>['onFinish'] = async (values: FieldType) => {
        const { mainText, author, category, price, quantity, thumbnail, slider } = values; 
        if(thumbnail.length > 0 && slider.length > 0) {
            const newThumbnail = thumbnail[0].name?? "";
            const newSlider = slider.map(item => item.name) ?? [];
            const res = await createBookAPI(mainText, author, category, price, quantity, newThumbnail, newSlider);
            if(res.data) {
                refreshTable();
                form.resetFields();
                setThumbnailList([]);
                setSliderList([]);
                setOpenCreateBook(false);
                message.success("Created successfully");
            }
            else {
                message.error("Created failed");
            }
        }
    }

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };
    return (
        <Modal
            title="Add new book"
            open={openCreateBook}
            onOk={() => {
                form.submit();
            }}
            // confirmLoading={confirmLoading}
            onCancel={() => {
                setOpenCreateBook(false);
            }}
        >
            <Form
                onFinish={handleOnFinishForm}
                form={form}
                layout="vertical"
            >
                <div style={{ display: "flex", gap: "20px" }}>
                    <Form.Item<FieldType>
                        label="Title"
                        name="mainText"
                        rules={[
                            { required: true, message: 'Tiêu đề không được để trống' },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Author"
                        name="author"
                        rules={[
                            { required: true, message: 'Tác giả không được để trống' },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </div>
                <div style={{ display: "flex", gap: "20px" }}>
                    <Form.Item<FieldType>
                        label="Price"
                        name="price"
                        rules={[{ required: true, message: 'Giá tiền không được để trống' }]}
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                            formatter={formatter}
                            parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                            suffix={'đ'}
                        />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Category"
                        name="category"
                        rules={[
                            { required: true, message: 'Thể loại' },
                        ]}
                    >
                        <Select
                            style={{ width: "100%s" }}
                            // onChange={handleChange}
                            options={categoryOption}

                        />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Quantity"
                        name="quantity"
                        rules={[
                            { required: true, message: 'Số lượng' },
                        ]}
                    >
                        <InputNumber />
                    </Form.Item>
                </div>
                <div style={{ display: "flex", gap: "20px" }}>
                    <Form.Item<FieldType>
                        label="Thumbnail image"
                        name="thumbnail"
                        rules={[
                            { required: true, message: 'Ảnh thumbnail không được để trống' },
                        ]}
                    >
                        <Upload
                            listType="picture-card"
                            fileList={thumbnailList}
                            onPreview={handlePreview}
                            customRequest={(options) => handleUploadFile(options, 'thumbnail')}
                            onChange={(info) => handleChangeUploadFile(info, 'thumbnail')}
                            beforeUpload={beforeUpload}
                            maxCount={1}
                            multiple={false}
                        >
                            <div>
                                {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>
                        {previewImage && (
                            <Image
                                style={{ display: 'none' }}
                                preview={{
                                    visible: previewOpen,
                                    onVisibleChange: (visible) => setPreviewOpen(visible),
                                }}
                                src={previewImage}
                            />
                        )}
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Slider images"
                        name="slider"
                        rules={[
                            { required: true, message: 'Ảnh slider không được để trống' },
                        ]}
                    >
                        <Upload
                            listType="picture-card"
                            fileList={sliderList}
                            onPreview={handlePreview}
                            customRequest={(options) => handleUploadFile(options, 'slider')}
                            onChange={(info) => handleChangeUploadFile(info, 'slider')}
                            beforeUpload={beforeUpload}
                            maxCount={8}
                            multiple={true}
                        >
                            <div>
                                {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>
                        {previewImage && (
                            <Image
                                style={{ display: 'none' }}
                                preview={{
                                    visible: previewOpen,
                                    onVisibleChange: (visible) => setPreviewOpen(visible),
                                }}
                                src={previewImage}
                            />
                        )}
                    </Form.Item>
                </div>

            </Form >
        </Modal>
    )
}

export default CreateBookModal;