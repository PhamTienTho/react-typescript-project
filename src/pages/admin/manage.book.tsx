import BookDetail from "@/components/admin/book/detail.book";
import BookTable from "@/components/admin/book/table.book";
import { useState } from "react";

const ManageBookPage = () => {
    const [openBookDetail, setOpenBookDetail] = useState(false);
    const [bookDetail, setBookDetail] = useState<IBookTable | null>(null);
    return (
        <>
            <BookTable
                setOpenBookDetail={setOpenBookDetail}
                bookDetail={bookDetail}
                setBookDetail={setBookDetail}
            />
            <BookDetail
                openBookDetail={openBookDetail}
                setOpenBookDetail={setOpenBookDetail}
                bookDetail={bookDetail}
                setBookDetail={setBookDetail}
            />
        </>
    )
}

export default ManageBookPage;