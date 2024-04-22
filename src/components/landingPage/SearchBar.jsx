import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const SearchBar = () => {
    const [querySearch, setquerySearch] = useState('')
    const Navigate = useNavigate()

    const search = (query) => {
        if (query !== '') {
          Navigate('/products/search/' + query)
          window.location.reload()
        }
    }

    return (
        <>
            <input type='text' onChange={(e) => setquerySearch(e.target.value)} className='w-full py-1 px-2 focus:outline-none focus:border-[#324D67]' placeholder='Search'/>
            <button><FaSearch onClick={() => search(querySearch)} fontSize={23}/></button>
        </>
    )
}

export default SearchBar