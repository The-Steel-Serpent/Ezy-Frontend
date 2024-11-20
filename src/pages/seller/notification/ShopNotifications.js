import React, { lazy, Suspense } from "react";

const NotificationSection = lazy(() =>
    import("../../../components/notifications/NotificationSection")
);

const ShopNotifications = () => {
    return (
        <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-8">
                <h3 className="text-3xl font-semibold text-gray-800 mb-6">Thông Báo</h3>
                <Suspense fallback={<div className="text-center text-gray-500">Loading...</div>}>
                    <NotificationSection />
                </Suspense>
            </div>
        </div>
    );
}

export default ShopNotifications;
