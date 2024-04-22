import React, {
    createContext,
    useContext
  } from "react";
import { useState } from "react";

  const Context = createContext();
  
  const FunctionsContext = ({ children }) => {

    const [itemsPerPage, setitemsPerPage] = useState(5)
    const [SearchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, settotalPages] = useState();
    
    const goToPreviousPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
    };

    const goToPage = (page) => {

        if(page > currentPage){

            setCurrentPage(prevPage => Math.min(prevPage + page - currentPage, totalPages));

        }else if (page < currentPage) {

            let pageNumber = currentPage - page
            setCurrentPage(prevPage => Math.min(prevPage - pageNumber, totalPages));

        }

    };

    const PrepareArrayItems = (Array, setArray) => {
      
        // Calculate the total number of pages
        const total_pages = Math.ceil(Array.length / itemsPerPage)
        
        settotalPages(total_pages);
                
        // Slice the list of products to display only the items for the current page
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        // set Products do listed in One page
        setArray(Array.slice(startIndex, endIndex))
    }

    const dataFilter = (array, setFilteredArray, value) => {

        setSearchQuery(value)
        
        const filteredData = array.filter(item =>
          item?.name?.toLowerCase().includes(value.toLowerCase()) ||
          item?.category_name?.toLowerCase().includes(value.toLowerCase()) ||
          parseInt(item?.numbre_products) === parseInt(value) || 
          parseInt(item?.quantity) === parseInt(value) ||
          parseInt(item?.price) === parseInt(value)
        );
        
        // when the search input empty return all product 
        if (value ==='') {
          
            setFilteredArray(array)
  
        }else{
  
            setFilteredArray(filteredData)
            goToPage(1)
  
        }
  
    }

    return (
      <Context.Provider
        value={{
            currentPage,
            itemsPerPage,
            totalPages,
            SearchQuery,
            goToNextPage,
            setCurrentPage,
            goToPreviousPage,
            goToPage,
            settotalPages,
            setitemsPerPage,
            PrepareArrayItems,
            dataFilter
        }}
      >
        {children}
      </Context.Provider>
    );
  };
  
  export default FunctionsContext;
  
  export const useFunctionsContext = () => useContext(Context);
  