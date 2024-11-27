import { Button, Empty, Image, Table } from 'antd';
import React, { useEffect, useReducer } from 'react';
import { AiOutlineNotification } from "react-icons/ai";
import { getSuggestSaleEventsForShop } from '../../../services/saleEventService';
import { formatDate } from '../../../helpers/formatDate';
import ModalSaleEventDetail from './ModalSaleEventDetail';
import dayjs from 'dayjs';

const SaleEventsItem = () => {

  const [localState, setLocalState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'SET_SALE_EVENTS':
          return { ...state, saleEvents: action.payload };
        case 'SET_DATA_SOURCE':
          return { ...state, dataSource: action.payload };
        case 'SET_CURRENT_PAGE':
          return { ...state, current_page: action.payload };
        case 'SET_PAGE_SIZE':
          return { ...state, page_size: action.payload };
        case 'SET_TOTAL_ITEMS':
          return { ...state, totalItems: action.payload };
        case 'SET_VISIBLE_SALE_EVENT_DETAIL_MODAL':
          return { ...state, visible_sale_event_detail_modal: action.payload };
        case 'SET_SELECTED_SALE_EVENT':
          return { ...state, selected_sale_event: action.payload };
        default:
          return state;
      }
    },
    {
      saleEvents: [],
      current_page: 1,
      totalItems: 0,
      dataSource: [],
      page_size: 8,
      visible_sale_event_detail_modal: false,
      selected_sale_event: null,
    }
  );

  const handleFetchSaleEvents = async (page, limit) => {
    try {
      const payload = { page, limit };
      const res = await getSuggestSaleEventsForShop(payload);
      if (res.success) {
        return res;
      }
    } catch (error) {
      console.log("Error in suggestSaleEventsForShop", error);
      return [];
    }
  };

  const onChangePage = (page, pageSize) => {
    setLocalState({ type: 'SET_CURRENT_PAGE', payload: page });
    setLocalState({ type: 'SET_PAGE_SIZE', payload: pageSize });
  };


  const columns = [
    {
      title: <div className="text-center font-semibold">Chương trình</div>,
      dataIndex: 'sale_events_name',
      key: 'sale_events_name',
      render: (text, record) => (
        <div className="flex items-center max-w-80">
          <Image src={record.thumbnail} width={50} height={50} className="rounded-md shadow" />
          <span className="ml-4 font-medium break-words line-clamp-2">{text}</span>
        </div>
      ),
    },
    {
      title: <div className="text-center font-semibold">Thời gian bắt đầu</div>,
      dataIndex: 'started_at',
      key: 'started_at',
      render: (text) => <div className="text-center">{text}</div>,
    },
    {
      title: <div className="text-center font-semibold">Thời gian kết thúc</div>,
      dataIndex: 'ended_at',
      key: 'ended_at',
      render: (text) => <div className="text-center">{text}</div>,
    },
    {
      title: <div className="text-center font-semibold">Trạng thái</div>,
      dataIndex: 'is_actived',
      key: 'is_actived',
      render: (text, record) => (
        record.is_actived ?
          <div className="text-center">Đang diễn ra</div> :
          <div className="text-cente">Sắp diễn ra</div>
      ),
    },
    {
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => handleClickDetail(record)}
          >Xem chi tiết</Button>
        </div>
      ),
    },
  ];

  const createDataSource = () => {
    return localState.saleEvents.map((sale_event, index) => ({
      key: index,
      sale_events_id: sale_event.sale_events_id,
      sale_events_name: sale_event.sale_events_name,
      started_at: dayjs(sale_event.started_at).format('DD/MM/YYYY HH:mm:ss'),
      ended_at: dayjs(sale_event.ended_at).format('DD/MM/YYYY HH:mm:ss'),
      thumbnail: sale_event.thumbnail,
      is_actived: sale_event.is_actived,
      DiscountVouchers: sale_event.DiscountVouchers,
      SaleEventsOnCategories: sale_event.SaleEventsOnCategories,
    }));
  };

  useEffect(() => {
    if (localState?.saleEvents?.length > 0) {
      const data_source = createDataSource();
      setLocalState({ type: 'SET_DATA_SOURCE', payload: data_source });
    }
  }, [localState.saleEvents]);

  useEffect(() => {
    const fetchData = async () => {
      const saleEvents = await handleFetchSaleEvents(localState.current_page, localState.page_size);
      setLocalState({ type: 'SET_SALE_EVENTS', payload: saleEvents?.data });
      console.log("Sale events:", saleEvents?.data);
      setLocalState({ type: 'SET_TOTAL_ITEMS', payload: saleEvents?.totalItems });
    };
    fetchData();
  }, [localState.current_page, localState.page_size]);

  const handleCancel = () => {
    setLocalState({ type: 'SET_VISIBLE_SALE_EVENT_DETAIL_MODAL', payload: false });
  }

  const handleClickDetail = (sale_event) => {
    setLocalState({ type: 'SET_SELECTED_SALE_EVENT', payload: sale_event });
    setLocalState({ type: 'SET_VISIBLE_SALE_EVENT_DETAIL_MODAL', payload: true });
  }
  return (
    <div className="mt-5 bg-white p-6 rounded-lg shadow-md">
      <Table
        locale={{
          emptyText: (
            <Empty
              image={<AiOutlineNotification size={100} />}
              description="Hiện tại chưa có chương trình nào"
              imageStyle={{ height: 100 }}
            />
          ),
        }}
        columns={columns}
        dataSource={localState.dataSource}
        pagination={{
          current: localState.current_page,
          pageSize: localState.page_size,
          total: localState.totalItems,
          onChange: onChangePage,
        }}
        className="rounded-lg overflow-hidden"
      />
      <ModalSaleEventDetail
        visible={localState.visible_sale_event_detail_modal}
        onCancel={handleCancel}
        sale_event={localState.selected_sale_event}
      />
    </div>
  );
};

export default SaleEventsItem;
