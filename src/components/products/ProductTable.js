import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Modal, Space, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import BooksApi from '../../api/booksApi';
import ApiQueryKeys from '../../constants/api.constant';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons"
import { ExclamationCircleOutlined } from "@ant-design/icons";
import ViewProduct from './ViewProduct';

const { confirm } = Modal

const ProductTable = () => {
    const [books, setBooks] = useState();
    const [isShowViewModal, setIsShowViewModal] = useState();
    const [selectedBook, setSelectedBook] = useState()
    const navigate = useNavigate()
    const { data } = useQuery({
        queryKey: [ApiQueryKeys.books],
        queryFn: () => BooksApi.getAll()
    })
    useEffect(() => {
        setBooks(data || [])
    }, [data])

    const columns = [
        {
            title: "#",
            dataIndex: "id",
            key: "id",
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: "Şəkil",
            dataIndex: "images",
            key: "coverImage",
            render: (value) =>


                <img style={{ width: "100px", height: "100px" }} src={value[0]?.imgUrl} alt="book" />
        },
        {
            title: "Məhsulun adı",
            dataIndex: "title",
            key: "title",
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: "Qiymət",
            dataIndex: "currentPrice",
            key: "title",
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: "Müəllif",
            dataIndex: "author",
            key: "author",
            sorter: (a, b) => a.author.localeCompare(b.author),
        },
        {
            title: "Dil",
            dataIndex: "language",
            key: "lang",
            render: (value) =>
                <span>{value.lang}</span>
        },
        {
            title: "",
            key: "action",
            width: 70,
            render: (value) =>
                <Space size="small">
                    <Link to={`/products/edit/${value.id}`}>
                        <EditOutlined style={{ color: 'green', fontSize: "17px" }} />
                    </Link>
                    <Button style={{ border: "none", boxShadow: "none", background: "transparent" }} onClick={() => handleDelete(value.id)}>
                        <DeleteOutlined style={{ color: "red", fontSize: "17px", marginLeft: "30px" }} />
                    </Button>
                </Space>

        },

        {
            title: "",
            key: "view",
            widt: 40,
            render: (value) =>
                <Space size="small">
                    <Button style={{ border: "none", boxShadow: "none", background: "transparent" }} onClick={() => handleViewProduct(value)}>
                        <EyeOutlined style={{ fontSize: "17px" }} />
                    </Button>
                </Space>

        },

    ]
    const handleViewProduct = (value) => {
        setSelectedBook(value);
        setIsShowViewModal(true)
    }
    const queryClient = useQueryClient()
    const deleteMutation = useMutation(BooksApi.deleteBook, {
        onSuccess: () => {
            queryClient.invalidateQueries([ApiQueryKeys.books])

        }
    })
    const handleDelete = (id) => {
        confirm({
            title: "Xəbərdarlıq",
            icon: <ExclamationCircleOutlined />,
            content: "Bu məhsulu silmək istədiyinizdən əminsiniz?",
            cancelText: "Xeyr",
            okText: "Bəli",
            onOk: () => {
                deleteMutation.mutate(id)
            }

        })
    }
    return (
        <div>
            <div className='flex flex-end' style={{ marginBottom: "30px" }}>
                <Button onClick={() => navigate("/products/add")} type='primary'>
                    <PlusOutlined />
                    Yeni Məhsul</Button>
            </div>
            <Table dataSource={books} columns={columns} />
            <ViewProduct selectedBook={selectedBook} setIsShowViewModal={setIsShowViewModal} isShowViewModal={isShowViewModal} />
        </div >
    )
}

export default ProductTable