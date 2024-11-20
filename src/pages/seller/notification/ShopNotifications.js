import React, { lazy, Suspense } from "react";

const NotificationSection = lazy(() =>
    import("../../../components/notifications/NotificationSection")
)

const ShopNotifications = () => {
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <h3 className="text-2xl font-semibold">Thông Báo</h3>
                <NotificationSection />
            </Suspense>
        </div>
    )
}

export default ShopNotifications