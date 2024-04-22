import { FaShop } from "react-icons/fa6";
import { BiCategory, BiPurchaseTag } from "react-icons/bi";
import { CgTrashEmpty } from "react-icons/cg";
import { FaHome } from "react-icons/fa";

export const links = [
    { name: 'Home', to: '/dashboard', icon : <FaHome fontSize={27} className="mr-2"/> },
    { name: 'Products', to: '/dashboard/products', icon : <FaShop fontSize={27} className="mr-2"/> },
    { name: 'Categories', to: '/dashboard/categories', icon : <BiCategory fontSize={27} className="mr-2"/> },
    { name: 'Orders', to: '/dashboard/orders', icon : <BiPurchaseTag fontSize={27} className="mr-2"/> },
    { name: 'Trashed Products', to: '/dashboard/trashed-products', icon : <CgTrashEmpty fontSize={27} className="mr-2"/> },
  ];