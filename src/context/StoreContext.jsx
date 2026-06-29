import { createContext,useEffect,useState } from "react";
import axios from "axios";
export const StoreContext= createContext(null)
const StoreContextProvider=(props)=>{
    const [cartItem, setCartItem] = useState({})
    const url = "https://food-app-backend-8jl2.onrender.com";
const [token, setToken] = useState(localStorage.getItem("token") || "");    const [food_list,setFoodList] = useState([])
    const addToCart= async(itemId)=>{
        if(!cartItem[itemId]){
            setCartItem((prev)=>({...prev,[itemId]:1}))
        }
        else{
            setCartItem((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        }

        if (token) {
            await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
        }
    }

    const removeFromCart= async(itemId)=>{
        setCartItem((prev)=>({...prev,[itemId]:prev[itemId]-1}))
        if (token) {
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
        }
    }

    const getTotalCartAmount=()=>{
        let totalAmount=0;
        for(const item in cartItem){
            if(cartItem[item]>0){
                let itemInfo = food_list.find((product)=>product._id===item)
            totalAmount += itemInfo.price * cartItem[item]
            }
            
        }
        return totalAmount;
    }

    const fetchFoodList= async()=>{
        const response= await axios.get(url+"/api/food/list")
        setFoodList(response.data.data)
    }

  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        {
          headers: { token },
        },
      );

      if (response.data.success) {
        setCartItem(response.data.data || {});
      }
    } catch (error) {
      console.error(error);
    }
  };

   useEffect(() => {
     const loadData = async () => {
       await fetchFoodList();

       if (token) {
         await loadCartData(token);
       }
     };

     loadData();
   }, [token]);
    const contextValue={
        food_list,
        cartItem,
        setCartItem,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken

    }
    return(
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;
