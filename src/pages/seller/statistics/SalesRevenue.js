import React, { useEffect, useReducer } from 'react';
import { useSelector } from 'react-redux';
import { getBestSellerShop, getSalesRevenue } from '../../../services/statisticService';
import { Line, Bar } from 'react-chartjs-2';
import { Button, DatePicker } from 'antd';
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
import BestSellerItem from './BestSellerItem';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
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
            return null;
        }
    };

    const handleGetSalesRevenue = async (shop_id, start_date, end_date) => {
        try {
            const res = await getSalesRevenue(shop_id, start_date, end_date);
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
    const handleExportExcel = async () => {
        const mapColumn = {
            day: 'Ngày',
            month: 'Tháng',
            year: 'Năm',
            total_revenue: 'Doanh thu',
        };
        const data = localState.sales_revenue?.revenueByDay || [];

        // Tạo workbook và worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Thống kê doanh thu bán hàng');

        // Thêm tiêu đề
        worksheet.mergeCells('A1:D1'); // Gộp cột A-D cho title
        const titleCell = worksheet.getCell('A1');
        titleCell.value = 'Bảng thống kê doanh thu';
        titleCell.font = { size: 20, bold: true }; // Chỉnh size và in đậm
        titleCell.alignment = { vertical: 'middle', horizontal: 'center' }; // Canh giữa
        titleCell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        }; // Thêm viền cho tiêu đề

        // Thêm khoảng cách cho title
        worksheet.getRow(1).height = 30; // Tăng chiều cao của dòng title

        // Thêm header
        worksheet.addRow([mapColumn.day, mapColumn.month, mapColumn.year, mapColumn.total_revenue]);
        const headerRow = worksheet.getRow(2);
        headerRow.font = { bold: true }; // Làm đậm header
        headerRow.alignment = { horizontal: 'center', vertical: 'middle' }; // Canh giữa header
        headerRow.eachCell(cell => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            }; // Thêm viền cho header
            cell.alignment = { horizontal: 'center', vertical: 'middle' }; // Căn giữa dữ liệu trong header
        });

        // Thêm dữ liệu
        data.forEach(item => {
            const row = worksheet.addRow([item.day, item.month, item.year, item.total_revenue]);
            row.eachCell(cell => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                }; // Thêm viền cho từng ô dữ liệu
                cell.alignment = { horizontal: 'center', vertical: 'middle' }; // Căn giữa dữ liệu trong các ô
            });
        });

        // Auto-filter cho dữ liệu
        const totalRows = data.length + 2; // Bao gồm title và header
        worksheet.autoFilter = `A2:D${totalRows}`;

        // Định dạng cột (width phù hợp)
        worksheet.columns = [
            { key: 'day', width: 15 },
            { key: 'month', width: 15 },
            { key: 'year', width: 15 },
            { key: 'total_revenue', width: 20 },
        ];

        // Xuất file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'doanh-thu-ban-hang.xlsx');
    };

    const dailyRevenue = localState.sales_revenue?.revenueByDay || [];
    const weeklyRevenue = (localState.sales_revenue?.revenueByWeek || []).filter((data) => data.week !== 0);
    const monthlyRevenue = (localState.sales_revenue?.revenueByMonth || []).sort((a, b) => {
        const dateA = new Date(a.year, a.month - 1);
        const dateB = new Date(b.year, b.month - 1);
        return dateA - dateB;
    });
    const yearlyRevenue = localState.sales_revenue?.revenueByYear || [];

    const dailyData = {
        labels: dailyRevenue.map((data) => `${data.day}/${data.month}/${data.year}`),
        datasets: [
            {
                label: 'Doanh thu hàng ngày',
                data: dailyRevenue.map((data) => data.total_revenue),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4,
            },
        ],
    };

    const weeklyData = {
        labels: weeklyRevenue.map((data) => `Tuần ${data.week}/${data.year}`),
        datasets: [
            {
                label: 'Doanh thu hàng tuần',
                data: weeklyRevenue.map((data) => data.total_revenue),
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.4,
            },
        ],
    };

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
                    console.log('salesRevenue', salesRevenue);
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
        <div className="p-8 bg-gray-100 rounded-lg shadow-xl space-y-6">
            <div className="text-center">
                <h3 className="text-3xl font-bold text-blue-600">Thống kê doanh thu bán hàng</h3>
                <div className="mt-6 flex gap-2 justify-center">
                    <RangePicker
                        format={'YYYY-MM-DD'}
                        placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                        onChange={onChangeDatePicker}
                        className="w-full max-w-lg"
                    />
                    <Button
                        onClick={() => handleExportExcel()}
                    >
                        Xuất Excel
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Monthly Revenue */}
                <div className="flex flex-col bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 text-center col-span-2 py-4">
                        Doanh thu tháng
                    </h2>
                    <div className="h-[400px] px-6 py-4 bg-gray-50">
                        <Line data={monthlyData} options={options} />
                    </div>
                </div>


                {/* Yearly Revenue */}
                <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
                    <h2 className="text-xl font-semibold text-gray-700 text-center py-4">Doanh thu năm</h2>
                    <div className="h-[400px] px-6 py-4 bg-gray-50">
                        <Bar data={yearlyData} options={options} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Daily Revenue */}
                <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
                    <h2 className="text-xl font-semibold text-gray-700 text-center py-4">Doanh thu ngày</h2>
                    <div className="h-[400px] px-6 py-4 bg-gray-50">
                        <Line data={dailyData} options={options} />
                    </div>
                </div>

                {/* Weekly Revenue */}
                <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
                    <h2 className="text-xl font-semibold text-gray-700 text-center py-4">Doanh thu tuần</h2>
                    <div className="h-[400px] px-6 py-4 bg-gray-50">
                        <Bar data={weeklyData} options={options} />
                    </div>
                </div>
            </div>

            <BestSellerItem
                products={localState?.best_seller_products?.products}
                total_price_revenue={localState?.best_seller_products?.total_price_revenue}
            />
        </div>
    );
};

export default SalesRevenue;
