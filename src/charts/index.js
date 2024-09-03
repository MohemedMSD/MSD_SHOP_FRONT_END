import React from "react";

const Order_count = React.lazy(() => import("./Order_count"));
const Order_profit = React.lazy(() => import("./Order_profit"));
const Visites = React.lazy(() => import("./Visites"));
const Categories_views = React.lazy(() => import("./Categories_views"));

export {
    Categories_views,
    Visites,
    Order_count,
    Order_profit
}