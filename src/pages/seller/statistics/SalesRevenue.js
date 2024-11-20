import React, { useEffect, useReducer } from 'react';
import { useSelector } from 'react-redux';
import { getBestSellerShop, getSalesRevenue } from '../../../services/statisticService';
import { Line, Bar } from 'react-chartjs-2';
import { DatePicker } from 'antd';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);
const { RangePicker } = DatePicker;

const SalesRevenue = () => {
    const shop = useSelector((state) => state.shop);
    const [localState, setLocalState] = useReducer(
        (state, action) => {
            switch (action.type) {
                case 'SET_BEST_SELLER_PRODUCTS':
                    return { ...state, best_seller_products: action.payload };
                case 'SET_SALES_REVENUE':
                    return { ...state, sales_revenue: action.payload };
                case 'SET_START_DATE':
                    return { ...state, start_date: action.payload };
                case 'SET_END_DATE':
                    return { ...state, end_date: action.payload };
                default:
                    return state;
            }
        },
        {
            best_seller_products: null,
            sales_revenue: null,
            start_date: null,
            end_date: null,
        }
    );

    const handleGetBestSeller = async (shop_id) => {
        try {
            const res = await getBestSellerShop(shop_id);
            if (res.success) return res.data;
        } catch (error) {
            console.error('Error getting best seller shop:', error);
            return [];
        }
    };

    const handleGetSalesRevenue = async (shop_id, start_date, end_date) => {
        try {
            const res = await getSalesRevenue(shop_id, start_date, end_date);
            console.log('Sales revenue:', res);
            if (res.success) return res.data;
        } catch (error) {
            console.error('Error getting sales revenue:', error);
            return [];
        }
    };

    const onChangeDatePicker = (date, dateString) => {
        const [startDate, endDate] = dateString;
        setLocalState({ type: 'SET_START_DATE', payload: startDate });
        setLocalState({ type: 'SET_END_DATE', payload: endDate });
    };

    const monthlyRevenue = (localState.sales_revenue?.revenueByMonth || []).sort((a, b) => {
        const dateA = new Date(a.year, a.month - 1);
        const dateB = new Date(b.year, b.month - 1);
        return dateA - dateB;
    });
    const yearlyRevenue = localState.sales_revenue?.revenueByYear || [];

    const monthlyData = {
        labels: monthlyRevenue.map((data) => `${data.month}/${data.year}`),
        datasets: [
            {
                label: 'Doanh thu hàng tháng',
                data: monthlyRevenue.map((data) => data.total_revenue),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
            },
        ],
    };

    const yearlyData = {
        labels: yearlyRevenue.map((data) => data.year),
        datasets: [
            {
                label: 'Doanh thu hàng năm',
                data: yearlyRevenue.map((data) => data.total_revenue),
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'Thống kê doanh số',
            },
        },
        layout: {
            padding: {
                top: 20,
                bottom: 20,
            },
        },
    };

    useEffect(() => {
        if (shop?.shop_id) {
            const fetchData = async () => {
                const bestSeller = await handleGetBestSeller(shop.shop_id);
                let salesRevenue;
                if (localState.start_date && localState.end_date) {
                    salesRevenue = await handleGetSalesRevenue(shop.shop_id, localState.start_date, localState.end_date);
                } else {
                    salesRevenue = await handleGetSalesRevenue(shop.shop_id);
                }
                setLocalState({ type: 'SET_BEST_SELLER_PRODUCTS', payload: bestSeller });
                setLocalState({ type: 'SET_SALES_REVENUE', payload: salesRevenue });
            };
            fetchData();
        }
    }, [shop, localState.start_date, localState.end_date]);

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-center text-blue-600">Doanh số bán hàng</h3>
                <div className="flex justify-center mt-4">
                    <RangePicker
                        format={'YYYY-MM-DD'}
                        placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                        onChange={onChangeDatePicker}
                        className="w-full md:w-1/2"
                    />
                </div>
            </div>
            <div>
                <div className="mb-10">
                    <h2 className="text-xl font-semibold text-center text-gray-700">Doanh thu theo từng tháng</h2>
                    <div className="h-[400px] bg-white rounded-lg p-4 shadow-md">
                        <Line data={monthlyData} options={options} />
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-center text-gray-700">Doanh thu hàng năm</h2>
                    <div className="h-[400px] bg-white rounded-lg p-4 shadow-md">
                        <Bar data={yearlyData} options={options} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesRevenue;
