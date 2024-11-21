import React from "react";
import { Card, Typography, Row, Col, Space } from "antd";

const { Title, Text } = Typography;

const BestSellerItem = (props) => {
    const { products, total_price_revenue } = props;

    return (
        <div className="p-6 bg-gray-50">
            <Title level={2} className="mb-6">
                Sản phẩm bán chạy
            </Title>
            <Row gutter={[24, 24]}>
                {products && products.length > 0 ? (
                    products.map((product, index) => (
                        <Col key={index} xs={24} sm={12} md={8} lg={6}>
                            <Card
                                hoverable
                                cover={
                                    <img
                                        alt={product.product_name}
                                        src={product.thumbnail}
                                        className="h-48 object-cover"
                                    />
                                }
                                className="rounded-lg shadow-lg flex flex-col justify-between h-full"
                            >
                                <Space
                                    direction="vertical"
                                    size="small"
                                    className="flex-1 flex flex-col justify-between"
                                >
                                    <div>
                                        <Title
                                            level={4}
                                            ellipsis={{ rows: 2 }}
                                            className="!text-gray-900 !leading-tight mb-2"
                                        >
                                            {product.product_name}
                                        </Title>
                                    </div>
                                    <div>
                                        <Text className="text-base font-semibold text-gray-700">
                                            Đã bán:{" "}
                                            <Text className="text-lg text-primary font-bold">
                                                {product.sold}
                                            </Text>
                                        </Text>
                                        <br />
                                        <Text className="text-base font-semibold text-gray-700">
                                            Doanh thu:{" "}
                                            <Text className="text-lg text-green-600 font-bold">
                                                {total_price_revenue[index]}
                                            </Text>
                                        </Text>
                                    </div>
                                </Space>
                            </Card>
                        </Col>
                    ))
                ) : (
                 null
                )}
            </Row>
        </div>
    );
};

export default BestSellerItem;
