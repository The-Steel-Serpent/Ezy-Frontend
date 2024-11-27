import React, { useEffect, useReducer } from 'react';
import { Bar } from 'react-chartjs-2';
import { DatePicker } from 'antd';
import {
    getTopSaleCategories,
    getTopProductVariientSales,
    getTopSellerShops,
} from '../../../services/statisticService';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const { RangePicker } = DatePicker;

const Statistics = () => {
    const [state, dispatch] = useReducer(
        (prevState, action) => {
            switch (action.type) {
                case 'SET_REVENUE_DATA':
                    return { ...prevState, revenueData: action.payload };
                case 'SET_SALE_CATEGORIES':
                    return { ...prevState, saleCategories: action.payload };
                case 'SET_PRODUCT_VARIANTS':
                    return { ...prevState, productVariants: action.payload };
                case 'SET_START_DATE':
                    return { ...prevState, startDate: action.payload };
                case 'SET_END_DATE':
                    return { ...prevState, endDate: action.payload };
                default:
                    return prevState;
            }
        },
        {
            revenueData: [],
            saleCategories: [],
            productVariants: [],
            startDate: null,
            endDate: null,
        }
    );

    const fetchStatisticsData = async () => {
        try {
            const { startDate, endDate } = state;
            const revenueData = await getTopSellerShops(startDate, endDate);
            const saleCategories = await getTopSaleCategories(startDate, endDate);
            const productVariants = await getTopProductVariientSales(startDate, endDate);

            if (revenueData.success) {
                dispatch({ type: 'SET_REVENUE_DATA', payload: revenueData.data.revenueByMonth });
            }

            if (saleCategories.success) {
                dispatch({ type: 'SET_SALE_CATEGORIES', payload: saleCategories.data });
            }

            if (productVariants.success) {
                dispatch({ type: 'SET_PRODUCT_VARIANTS', payload: productVariants.data });
            }
        } catch (error) {
            console.error('Error fetching statistics data:', error);
        }
    };

    const onDateRangeChange = (dates, dateStrings) => {
        const [startDate, endDate] = dateStrings;
        dispatch({ type: 'SET_START_DATE', payload: startDate });
        dispatch({ type: 'SET_END_DATE', payload: endDate });
    };

    useEffect(() => {
        if (state.startDate && state.endDate) {
            fetchStatisticsData();
        }
    }, [state.startDate, state.endDate]);

    // Data for Top Shop Revenue Bar Chart
    const shopRevenueData = {
        labels: state.revenueData.map((data) => data.shop_name),
        datasets: [
            {
                label: 'Doanh thu (VND)',
                data: state.revenueData.map((data) => data.total_revenue),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Data for Top Sale Categories Bar Chart
    const saleCategoryData = {
        labels: state.saleCategories.map((data) => data.category_name),
        datasets: [
            {
                label: 'Số lượng bán được',
                data: state.saleCategories.map((data) => data.total_quantity_sold),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Data for Top Product Variants Bar Chart
    const productVariantData = {
        labels: state.productVariants.map((data) => data.product_name),
        datasets: [
            {
                label: 'Số lượng bán được',
                data: state.productVariants.map((data) => data.total_quantity_sold),
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'Thống kê',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Danh mục / Cửa hàng / Sản phẩm',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Giá trị',
                },
            },
        },
    };

    return (
        <div className="p-8 bg-gray-100 rounded-lg shadow-md space-y-6">
            <div className="text-center">
                <h3 className="text-3xl font-bold text-blue-600">Thống kê doanh thu và sản phẩm</h3>
                <div className="mt-4">
                    <RangePicker
                        format="YYYY-MM-DD"
                        onChange={onDateRangeChange}
                        className="w-full max-w-lg mx-auto"
                    />
                </div>
            </div>

            <div className="mt-6 bg-white rounded-lg shadow-md p-4">
                <h4 className="text-xl font-semibold text-center">Top 5 Cửa hàng có doanh thu cao nhất</h4>
                <div className="h-[500px]">
                    <Bar data={shopRevenueData} options={chartOptions} />
                </div>
            </div>

            <div className="mt-6 bg-white rounded-lg shadow-md p-4">
                <h4 className="text-xl font-semibold text-center">Danh mục bán chạy nhất</h4>
                <div className="h-[500px]">
                    <Bar data={saleCategoryData} options={chartOptions} />
                </div>
            </div>

            <div className="mt-6 bg-white rounded-lg shadow-md p-4">
                <h4 className="text-xl font-semibold text-center">Sản phẩm bán chạy nhất</h4>
                <div className="h-[500px]">
                    <Bar data={productVariantData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

export default Statistics;
