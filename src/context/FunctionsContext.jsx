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
    
    const goToPreviousPage = (setCurrentPage, setchangePage = null) => {

        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));

        if (setchangePage) {
          setchangePage(true)
        }

    };

    const goToNextPage = (setCurrentPage, setchangePage = null, total_Pages = totalPages) => {

        setCurrentPage(prevPage => Math.min(prevPage + 1, total_Pages));

        if (setchangePage) {
          setchangePage(true)
        }

    };

    const goToPage = (page, currentPage, setCurrentPage, totalPages, setchangePage = null) => {

        if(page > currentPage){

            setCurrentPage(prevPage => Math.min(prevPage + page - currentPage, totalPages));
            
            if (setchangePage) {
              setchangePage(true)
            }

        }else if (page < currentPage) {

            let pageNumber = currentPage - page
            setCurrentPage(prevPage => Math.min(prevPage - pageNumber, totalPages));

            if (setchangePage) {
              setchangePage(true)
            }

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

    // runder number of pages
    const renderPages = (currentPage, totalPages, setCurrentPage, setchangePage) => {

      const maxPagesVisible = 4;
      const pages = []

      for (let i = 1; i <= totalPages; i++) {
        
        if (i <= maxPagesVisible || i == currentPage || i + 1 == currentPage || i - 1 == currentPage || i == totalPages) {
          
          pages.push(
            <li key={i}>
              <button
                onClick={() => goToPage(i, currentPage, setCurrentPage, totalPages, setchangePage)}
                href="#"
                className={`block ${
                currentPage == i
                  ? "border-second bg-second text-white"
                  : "border-gray-100 bg-white text-gray-900"
                } size-8 rounded border text-center leading-8 `}
              >
                {i}
              </button>
            </li>
          )
        }else if(pages[pages.length - 1] != '...'){
          pages.push('...')
        }
        
      }
      
      return pages
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
            dataFilter,
            renderPages
        }}
      >
        {children}
      </Context.Provider>
    );
  };
  
  export default FunctionsContext;
  
  export const useFunctionsContext = () => useContext(Context);
  