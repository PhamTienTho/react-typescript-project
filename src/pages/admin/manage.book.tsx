import CreateBookModal from "@/components/admin/book/create.book";
import BookDetail from "@/components/admin/book/detail.book";
import BookTable from "@/components/admin/book/table.book";
import { ActionType } from "@ant-design/pro-components";
import { useRef, useState } from "react";

const ManageBookPage = () => {
    const [openBookDetail, setOpenBookDetail] = useState(false);
    const [bookDetail, setBookDetail] = useState<IBookTable | null>(null);
    const [openCreateBook, setOpenCreateBook] = useState(false);
    const actionRef = useRef<ActionType>();

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    return (
        <>
            <BookTable
                setOpenBookDetail={setOpenBookDetail}
                bookDetail={bookDetail}
                setBookDetail={setBookDetail}
                setOpenCreateBook={setOpenCreateBook}
                actionRef={actionRef}
            />
            <BookDetail
                openBookDetail={openBookDetail}
                setOpenBookDetail={setOpenBookDetail}
                bookDetail={bookDetail}
                setBookDetail={setBookDetail}
            />
            <CreateBookModal
                openCreateBook={openCreateBook}
                setOpenCreateBook={setOpenCreateBook}
                refreshTable={refreshTable}
            />
        </>
    )
}

export default ManageBookPage;