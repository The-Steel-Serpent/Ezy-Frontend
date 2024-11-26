import React, { useEffect, useReducer } from 'react';
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

const Statistics = () => {
    const [state, dispatch] = useReducer(
        (prevState, action) => {
            switch (action.type) {
                case 'SET_REVENUE_DATA':
                    return { ...prevState, revenueData: action.payload };
                case 'SET_START_DATE':
                    return { ...prevState, startDate: action.payload };
                case 'SET_END_DATE':
                    return { ...prevState, endDate: action.payload };
                default:
                    return prevState;
            }
        },
        {
            revenueData: null,
            startDate: null,
            endDate: null,
        }
    );

    const fetchRevenueData = async (startDate, endDate) => {
        try {
            console.log('Fetching revenue data with params:', { startDate, endDate });
            const response = await fetch(
                `http://localhost:8080/api/statistical/get-top-shop-sales-revenue?start_date=${startDate}&end_date=${endDate}`
            );

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} - ${response.statusText}`);
            }

            const result = await response.json();
            if (result.success) {
                const updatedData = {
                    ...result.data,
                    revenueByDay: result.data.revenueByDay.map((item) => ({
                        ...item,
                        platform_revenue: item.total_revenue,
                    })),
                    revenueByWeek: result.data.revenueByWeek.map((item) => ({
                        ...item,
                        platform_revenue: item.total_revenue,
                    })),
                    revenueByMonth: result.data.revenueByMonth.map((item) => ({
                        ...item,
                        platform_revenue: item.total_revenue,
                    })),
                    revenueByYear: result.data.revenueByYear.map((item) => ({
                        ...item,
                        platform_revenue: item.total_revenue,
                    })),
                };
                dispatch({ type: 'SET_REVENUE_DATA', payload: updatedData });
            } else {
                console.error('Error from API:', result.message);
            }
        } catch (error) {
            console.error('Error fetching revenue data:', error);
        }
    };

    const onChangeDatePicker = (dates, dateStrings) => {
        const [startDate, endDate] = dateStrings;
        dispatch({ type: 'SET_START_DATE', payload: startDate });
        dispatch({ type: 'SET_END_DATE', payload: endDate });
    };

    useEffect(() => {
        if (!state.startDate || !state.endDate) {
            const now = new Date();
            const defaultEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Ngày cuối tháng hiện tại
            const defaultStartDate = new Date(now.getFullYear(), now.getMonth() - 2, 1); // 3 tháng trước

            dispatch({ type: 'SET_START_DATE', payload: defaultStartDate.toISOString().split('T')[0] });
            dispatch({ type: 'SET_END_DATE', payload: defaultEndDate.toISOString().split('T')[0] });
        } else {
            fetchRevenueData(state.startDate, state.endDate);
        }
    }, [state.startDate, state.endDate]);

    const revenueByDay = state.revenueData?.revenueByDay || [];
    const revenueByWeek = state.revenueData?.revenueByWeek || [];
    const revenueByMonth = state.revenueData?.revenueByMonth || [];
    const revenueByYear = state.revenueData?.revenueByYear || [];

    const dailyData = {
        labels: revenueByDay.map((data) => `${data.day}/${data.month}/${data.year}`),
        datasets: [
            {
                label: 'Doanh thu sàn theo ngày (4%)',
                data: revenueByDay.map((data) => data.platform_revenue),
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
//                tension: 0.4,
            },
        ],
    };

    const weeklyData = {
        labels: revenueByWeek.map((data) => `Tuần ${data.week}/${data.year}`),
        datasets: [
            {
                label: 'Doanh thu sàn theo tuần (4%)',
                data: revenueByWeek.map((data) => data.platform_revenue),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                tension: 0.4,
            },
        ],
    };

    const monthlyData = {
        labels: revenueByMonth.map((data) => `${data.month}/${data.year}`),
        datasets: [
            {
                label: 'Doanh thu sàn theo tháng (4%)',
                data: revenueByMonth.map((data) => data.platform_revenue),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
//                tension: 0.4,
            },
        ],
    };

    const yearlyData = {
        labels: revenueByYear.map((data) => data.year),
        datasets: [
            {
                label: 'Doanh thu sàn theo năm (4%)',
                data: revenueByYear.map((data) => data.platform_revenue),
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
//                tension: 0.4,
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
                text: 'Thống kê doanh thu sàn (4%)',
            },
        },
    };

    return (
        <div className="p-8 bg-gray-100 rounded-lg shadow-md space-y-6">
            <div className="text-center">
                <h3 className="text-3xl font-bold text-blue-600">Cửa hàng có doanh thu cao nhất</h3>
                <div className="mt-4">
                    <RangePicker
                        format="YYYY-MM-DD"
                        onChange={onChangeDatePicker}
                        className="w-full max-w-lg mx-auto"
                    />
                </div>
            </div>
{/* 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h4 className="text-xl font-semibold text-center">Doanh thu theo ngày</h4>
                    <div className="h-[400px]">
                        <Line data={dailyData} options={chartOptions} />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-4">
                    <h4 className="text-xl font-semibold text-center">Doanh thu theo tuần</h4>
                    <div className="h-[400px]">
                        <Line data={weeklyData} options={chartOptions} />
                    </div>
                </div>
            </div> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h4 className="text-xl font-semibold text-center">Doanh thu theo tháng</h4>
                    <div className="h-[400px]">
                        <Bar data={monthlyData} options={chartOptions} />
                    </div>
                </div>

                {/* <div className="bg-white rounded-lg shadow-md p-4">
                    <h4 className="text-xl font-semibold text-center">Doanh thu theo năm</h4>
                    <div className="h-[400px]">
                        <Bar data={yearlyData} options={chartOptions} />
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default Statistics;
