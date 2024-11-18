import { Table, Empty, Button } from 'antd';
import { AiOutlineNotification } from "react-icons/ai";
import React, { useEffect, useReducer } from 'react';
import { getSuggestFlashSaleForShop } from '../../../services/flashSaleService';
import FrameTimeFlashSale from './FrameTimeFlashSale';
import { formatDate } from '../../../helpers/formatDate';

const FlashSaleItem = () => {

    const [localState, setLocalState] = useReducer(
        (state, action) => {
            switch (action.type) {
                case 'SET_FLASH_SALES':
                    return { ...state, flashSales: action.payload };
                case 'SET_DATA_SOURCE':
                    return { ...state, dataSource: action.payload };
                case 'SET_CURRENT_PAGE':
                    return { ...state, current_page: action.payload };
                case 'SET_PAGE_SIZE':
                    return { ...state, page_size: action.payload };
                case 'SET_TOTAL_ITEMS':
                    return { ...state, totalItems: action.payload };
                case 'SET_VISIBLE_TIME_FRAME':
                    return { ...state, visile_time_frame: action.payload };
                case 'SET_SELECTED_TIME_FRAMES':
                    return { ...state, selected_time_frames: action.payload };
                default:
                    return state;
            }
        },
        {
            flashSales: [],
            current_page: 1,
            totalItems: 0,
            dataSource: [],
            current_page: 1,
            page_size: 8,
            visile_time_frame: false,
            selected_time_frames: null
        }
    )

    const columns = [
        {
            title: 'Tên chương trình',
            dataIndex: 'flash_sales_name',
            key: 'flash_sales_name',
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'started_at',
            key: 'started_at',
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'ended_at',
            key: 'ended_at',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        // {
        //     title: 'Trạng thái',
        //     dataIndex: 'status',
        //     key: 'status',
        // },
        {
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => {
                return (
                    <Button
                        className='bg-white text-primary hover:text-white hover:bg-primary'
                        onClick={() => handleSelectTimeFrame(record.FlashSaleTimeFrames)}
                    >
                        Chọn khung giờ
                    </Button>
                )

            }
        },
    ]

    const createDataSource = () => {
        const dataSouce = localState.flashSales.map((flash_sales, index) => {
            return {
                key: index,
                flash_sales_name: flash_sales.flash_sales_name,
                started_at: formatDate(flash_sales.started_at),
                ended_at: formatDate(flash_sales.ended_at),
                description: flash_sales.description,
                status: flash_sales.status,
                FlashSaleTimeFrames: flash_sales.FlashSaleTimeFrames
            }
        })
        return dataSouce;
    }

    useEffect(() => {
        if (localState?.flashSales?.length > 0) {
            const data_source = createDataSource();
            setLocalState({ type: "SET_DATA_SOURCE", payload: data_source });
        }
    }, [localState.flashSales])


    const handleFetchFlashSales = async (page, limit) => {
        try {
            const payload = { page: page, limit: limit };
            const response = await getSuggestFlashSaleForShop(payload);
            if (response.success) {
                console.log("FlashSale", response);
                return response;
            } else {
                console.log(response.message);
                return [];
            }
        } catch (error) {
            console.error("Error fetching flash sales:", error);
            return [];
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const flashSales = await handleFetchFlashSales(localState.current_page, localState.page_size);
            setLocalState({ type: 'SET_FLASH_SALES', payload: flashSales.data });
            setLocalState({ type: 'SET_TOTAL_ITEMS', payload: flashSales.totalItems });
        };
        fetchData();
    }, [
        localState.current_page,
        localState.page_size,
        localState.current_page,
    ]);

    const onChangePage = (page, pageSize) => {
        setLocalState({ type: 'SET_CURRENT_PAGE', payload: page });
        setLocalState({ type: 'SET_PAGE_SIZE', payload: pageSize });
    }

    const handleSelectTimeFrame = (frames_time) => {
        setLocalState({ type: 'SET_VISIBLE_TIME_FRAME', payload: true });
        setLocalState({ type: 'SET_SELECTED_TIME_FRAMES', payload: frames_time });
    }

    return (
        <div className='mt-5'>
            {
                localState.visile_time_frame ? (
                    <FrameTimeFlashSale localState={localState} setLocalState={setLocalState} />
                ) : (
                    <Table
                        locale={{
                            emptyText: (
                                <Empty
                                    image={<AiOutlineNotification size={100} />}
                                    description="Hiện tại chưa có chương trình nào"
                                />
                            )
                        }}
                        columns={columns}
                        dataSource={localState.dataSource}
                        pagination={{
                            current: localState.current_page,
                            pageSize: localState.page_size,
                            total: localState.totalItems,
                            onChange: onChangePage
                        }}
                    />
                )
            }
        </div>
    );
}

export default FlashSaleItem;