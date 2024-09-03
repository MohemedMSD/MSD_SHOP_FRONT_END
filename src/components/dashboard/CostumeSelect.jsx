import React, { useState } from 'react'
import { useEffect } from 'react';

const CostumeSelect = ({bg_gradient, ErrColor, setColor, Color, action}) => {

    const [selectedItem, setSelectedItem] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    
    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    useEffect(()=>{
        setSelectedItem(Color.id)
    }, [selectedItem])

    const handleSelect = (option) => {
        setSelectedItem(option);
        setColor(bg_gradient[option - 1])
        setIsOpen(false);
    };
    
    return (
        <div className={` ${ErrColor ? 'border-second' : 'border-gray-400'} border w-3/4  rounded-lg focus:border-primary_text outline-none`}>
            
            <div
                className="p-2 text-white font-semibold cursor-pointer"
                onClick={ action !== 'show' && handleToggle}
                style={{
                    backgroundImage: `linear-gradient(to right, ${bg_gradient[selectedItem - 1]?.from}, ${bg_gradient[selectedItem - 1]?.to})`
                }}
            >
                {selectedItem ? selectedItem : 'Select an option'}
            </div>

            {isOpen && (
                <ul className="mt-1">
                    {bg_gradient.map((option, index) => (
                        <li
                            key={index}
                            style={{
                                backgroundImage: `linear-gradient(to right, ${option.from}, ${option.to})`
                            }}
                            className={`p-2 text-white font-semibold bg-gradient-to-r from-[${option.from}] to-[${option.to}] hover:bg-gray-200 cursor-pointer`}
                            onClick={() => handleSelect(index + 1)}
                        >
                            {parseInt(index + 1)}
                        </li>
                    ))}
                </ul>
            )}

        </div>
    );
}

export default CostumeSelect