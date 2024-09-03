import React from "react";
const ProductM  = React.lazy(()=>import('./dashboard/modals/ProductM'))
const Header  = React.lazy(()=>import("./dashboard/Header"))
const CategoryM  = React.lazy(()=>import("./dashboard/modals/CategoryM"))
const OrderM  = React.lazy(()=>import("./dashboard/modals/OrderM"))
const ProfileM  = React.lazy(()=>import("./dashboard/modals/ProfileM"))
const CancelCom  = React.lazy(()=>import("./landingPage/CancelCom"))
const Card  = React.lazy(()=>import("./landingPage/Card"))
const Footer  = React.lazy(()=>import("./landingPage/Footer"))
const Home  = React.lazy(()=>import("./landingPage/Home"))
const NavBar  = React.lazy(()=>import("./landingPage/NavBar"))
const Product  = React.lazy(()=>import("./landingPage/Product"))
const ProductDetails  = React.lazy(()=>import("./landingPage/ProductDetails"))
const SearchBar  = React.lazy(()=>import("./landingPage/SearchBar"))
const SuccessCom  = React.lazy(()=>import("./landingPage/SuccessCom"))
const Loading  = React.lazy(()=>import("./Loading"))
const Notification  = React.lazy(()=>import("./Notification"))
const Profile  = React.lazy(()=>import("./Profile"))
const SideBar  = React.lazy(()=>import("./SideBar"))
const MyOrders = React.lazy(() => import('./landingPage/MyOrders'));
const Timer = React.lazy(() => import('./Timer'));
const Services = React.lazy(() => import('./Services'));
const Categories_Com = React.lazy(() => import('./landingPage/Categories'));
const FooterBanner = React.lazy(()=> import('./landingPage/FooterBanner'))
const Partners = React.lazy(()=> import('./landingPage/Partners'))
const Review = React.lazy(()=> import('./landingPage/Review'))
const DiscountM = React.lazy(()=> import('./dashboard/modals/DiscountM'))
const CostumeSelect = React.lazy(()=> import('./dashboard/CostumeSelect'))
const Comments = React.lazy(()=> import('./dashboard/Comments'))
const ReviewsDetails = React.lazy(()=> import('./dashboard/modals/ReviewsDetails'))
const AddReview = React.lazy(()=> import('./landingPage/AddReview'))
const ReviewImages = React.lazy(()=> import('./landingPage/modals/ReviewImages'))
const CostumerAdress = React.lazy(()=> import('./landingPage/modals/CostumerAdress'))

export {
    CostumerAdress,
    CostumeSelect,
    ReviewImages,
    AddReview,
    Review,
    ReviewsDetails,
    Comments,
    Partners,
    DiscountM,
    FooterBanner,
    Categories_Com,
    Services,
    Timer,
    SideBar,
    Loading,
    Footer,
    NavBar,
    Home,
    ProductDetails,
    Header,
    Profile,
    Card,
    CancelCom,
    SuccessCom,
    SearchBar,
    CategoryM,
    ProductM,
    OrderM,
    Product,
    ProfileM,
    Notification,
    MyOrders
}