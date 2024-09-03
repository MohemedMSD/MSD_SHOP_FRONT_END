import React, { useState, useEffect } from 'react'
import { Doughnut } from 'react-chartjs-2';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import Axios from '../assets/constants/axios/axios'
import {Chart as  ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Categories_views = () => {
  
    const [Data, setData] = useState({keys : [], values : []})
    const [typeSort, settypeSort] = useState('month')
    const [currentDate, setcurrentDate] = useState(new Date().toISOString().split('T')[0])

    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        }
    };

    
    const DisplayBy = async (typeSort, date) => {

      try {
        
        settypeSort(typeSort)
        setcurrentDate(date)

        const res = await Axios.get(`/statistic/categories-views/${date}/${typeSort}`);

        if (res?.status == 200) {
          
          setData({
            keys : res.data.map(item => item.name),
            values : res.data.map(item => item.views)
          })

        }

      } catch (error) {
        console.log(error)
      }


    }

    const NextOrPreviosDate = (action) => {

      if (action == 'inc') { 
        
        const date = new Date(currentDate)

        if(typeSort == 'month'){

          date.setMonth(date.getMonth() + 1)

        }else if(typeSort == 'year'){
          
          date.setFullYear(date.getFullYear() + 1)

        }

        setcurrentDate(date.toISOString().split('T')[0]);

      }else if(action == 'dec') {

        const date = new Date(currentDate)

        if(typeSort == 'month'){

          date.setMonth(date.getMonth() - 1)

        }else if(typeSort == 'year'){
          
          date.setFullYear(date.getFullYear() - 1)

        }

        setcurrentDate(date.toISOString().split('T')[0]);

      }
      

    }

    useEffect(() => {
      
      DisplayBy(typeSort, currentDate)
      
    }, [currentDate])

    const generateColors = (length) => {

        const colors = ['240 47 54', '50 77 103'];
        const opacities = [1, 0.95]
        const result = [];

        for (let i = 0; i < length; i++) {
            
            let color;
            let opacity;

            if ( i < Math.round(length/2)) {
                color = colors[0]
                opacity = (Math.round(length/2) - (Math.round(length/2) - i)) * 5
            }else{
                color = colors[1]
                opacity =  (i - Math.round(length/2)) * 5
            }

            const colorGen = `rgb(${color} / ${100 - opacity}%)`
            result.push(colorGen)

        }

        return result

    }

    return (
      <div className="h-full mb-6 w-full relative pb-5">

          <h2 className=" text-primary_text mb-3 text-center font-bold text-[20px] md:text-[22px] lg:text-[23px] xl:text-[25px]">
            Categories views
          </h2>

          <div className='flex items-center justify-center'>

            <button
              className={`${
                typeSort === 'year' ? "bg-second text-white" : "text-second"
              } px-3 rounded-lg hover:text-white hover:bg-second mr-3 border font-semibold  border-second`}
              onClick={() =>
                DisplayBy('year', new Date().toISOString().split("T")[0])
              }
            >
              Années
            </button>

            <button
              className={`${
                typeSort === 'month' ? "bg-second text-white" : "text-second"
              } px-3 rounded-lg hover:text-second hover:second border font-semibold  border-second`}
              onClick={() =>
                DisplayBy('month', new Date().toISOString().split("T")[0])
              }
            >
              Mois
            </button>

          </div>

          <div className="mt-5 relative flex flex-col items-center md:h-[520px] xl:mb-1 xl:h-[480px]">

            <div className="flex w-full justify-between items-center">

              <button
                className="p-2 hover:bg-second hover:text-white transition-all top-[50%] border text-second border-second rounded-full -left-8"
                onClick={() => NextOrPreviosDate("dec")}
              >
                <FaAngleLeft />
              </button>

              <p>
                {typeSort === 'month'
                  ? new Date(currentDate).toLocaleDateString("FR", {
                      month: "long",
                      year: "numeric",
                    })
                  : new Date(currentDate).getFullYear()}
              </p>

              <button
                className="p-2 hover:bg-second hover:text-white transition-all top-[50%] float-end border text-second border-second rounded-full -right-8"
                onClick={() => NextOrPreviosDate("inc")}
              >
                <FaAngleRight />
              </button>

            </div>
          
            <Doughnut 
              options={options} data={{
                labels : Data.keys,
                datasets : [{
                    label : 'Montant',
                    data : Data.values,
                    backgroundColor : generateColors(Data.values.length),
                    borderWidth : 1
                }]
            }} className='text-gray-300' />

          </div>

        </div>
    )
    
}

export default Categories_views