import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const SearchBar = ({query}) => {
    const [querySearch, setquerySearch] = useState(query)
    const Navigate = useNavigate()

    const search = (query) => {
        if (query !== '') {
          Navigate('/products-search/' + query)
          window.location.reload()
        }
    }

    const hundelChange = (e) => {
        const regex = /^[\w\s\-\_\=\+]+$/
        if (regex.test(e.target.value) || e.target.value == '') {
            
            setquerySearch(e.target.value)

        }
    }

    return (
        <>
            <input type='text' value={querySearch} onChange={(e) => hundelChange(e)} className='w-full py-1 px-2 focus:outline-none focus:border-primary_text' placeholder='Search'/>
            <button><FaSearch onClick={() => search(querySearch)} fontSize={23}/></button>
        </>
    )
}

export default SearchBar