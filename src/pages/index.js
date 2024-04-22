import React from "react";
const Dashboard = React.lazy(() => import("./Dashboard"));
const LandingPage = React.lazy(() => import("./LandingPage"));
const Login = React.lazy(() => import("./auth/Login"));
const Register = React.lazy(() => import("./auth/Register"));
const CategoriesManagement = React.lazy(() => import("./CategoriesManagement"));
const ArchiveOrders = React.lazy(() => import("./ArchiveOrders"));
const OrdersManagement = React.lazy(() => import("./OrdersManagement"));
const ProductsManagement = React.lazy(() => import("./ProductsManagement"));
const Search = React.lazy(() => import("./Search"));
const Auth = React.lazy(() => import("./auth/Auth"));
const GuestLayout = React.lazy(() => import("./auth/GuestLayout"));
const TrashedProducts = React.lazy(() => import("./TrashedProducts"));
const HomeDashboard = React.lazy(() => import("./HomeDashboard"));

export {
  LandingPage,
  Dashboard,
  Login,
  Register,
  CategoriesManagement,
  ArchiveOrders,
  ProductsManagement,
  OrdersManagement,
  Search,
  Auth,
  GuestLayout,
  TrashedProducts,
  HomeDashboard,
};
