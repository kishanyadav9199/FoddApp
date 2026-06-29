import React, { useContext } from 'react'
import './FoodDisplay.css'
import FoodItem from '../FoodItem/FoodItem'
import { StoreContext } from '../../context/StoreContext'
const FoodDisplay = ({category}) => {
    const {food_list}= useContext(StoreContext)
  return (
    <div className='food-display' id='food-display'>
        <h2>Top dishes near you</h2>
        <div className="food-display-list">
          {food_list.map((item,index)=>{
            if (
              category === "All" ||
              category.toLowerCase() === item.category.toLowerCase()
            ) {
              console.log("Selected:", category);
              console.log(
                food_list.filter(
                  (item) =>
                    item.category.toLowerCase() === category.toLowerCase(),
                ),
              );
              return (
                <FoodItem
                  key={index}
                  id={item._id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                />
              );
            }
          })}
        </div>
    </div>
  )
}

export default FoodDisplay
