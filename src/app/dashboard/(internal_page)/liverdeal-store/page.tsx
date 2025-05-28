"use client";


import { RootState } from "@/redux-store/redux_store";
import { scraper_store_add_admin_api, scraper_store_delete_admin_api, scraper_store_list_admin_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import React, {  useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const LiveDealStore = () => {

  const [formData, setFormData] = useState({
    url: '',
    title: '',
    price: '',
    source: '',
    image: '',
    redirect_url: '',
    real_price: '',
    main_container: '',
  });

  const [showList, setShowList] = useState(false)
  type StoreItem = {
    _id: string;
    url: string;
    title: string;
    price: string;
    source: string;
    image: string;
    redirect_url: string;
    real_price: string;
    main_container: string;
  };
  
  const [storeList, setStoreList] = useState<StoreItem[]>([])

  const token = useSelector((state: RootState) => state.user.token);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        scraper_store_add_admin_api,
        {
          url:formData.url,
          title:formData.title,
          main_container:formData.main_container,
          price:formData.price,
          real_price:formData.real_price,
          source:formData.source,
          image:formData.image,
          redirect_url:formData.redirect_url
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(data.message);
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error: unknown) => {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } else {
      console.error("Unknown error", error);
    }
  };


const getStore = async ()=>{
 
  try {
    const { data } = await axios.post(
      scraper_store_list_admin_api,
      {
        
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setShowList(true)

    setStoreList(data.data)

    toast.success(data.message);
  } catch (error) {
    handleError(error);
  }
}

// console.log(storeList)

const delete_store  =  async(id:string)=>{
  try {
    const { data } = await axios.post(
      scraper_store_delete_admin_api,
      {
        id:id
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  
    toast.success(data.message);
  } catch (error) {
    handleError(error);
  }
}

  return (
    <>
      <h1 className="text-2xl py-2 font-medium text-secondary_color">
        Live Deal Store
      </h1>
      <div className="max-w-4xl my-10 mx-auto p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
      
        <form onSubmit={handleSubmit} className="space-y-6">
          <h1 className="text-3xl">Add Store</h1>
          <div className="grid grid-cols-2 gap-3 mb-5">
          <input
             required
              type="text"
              name="main_container"
              value={formData.main_container}
              onChange={handleInputChange}
              placeholder="enter main_container class name"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              required
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="enter title class name"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
           
          </div>
         
          <div className="grid grid-cols-2 gap-3 mb-5">
          <input
              type="text"
              required
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="enter price class name"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="real_price"
              value={formData.real_price}
              onChange={handleInputChange}
              placeholder="enter real_price class name"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
           
          </div>
          <div className="grid grid-cols-2 gap-3 mb-5">
          <input
              type="text"
              name="source"
              required
              value={formData.source}
              onChange={handleInputChange}
              placeholder="enter Store name"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="image"
              required
              value={formData.image}
              onChange={handleInputChange}
              placeholder="enter image class name"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
           
          </div>
          <div className="grid  gap-3 mb-5">
          <input
              type="text"
              name="redirect_url"
              required
              value={formData.redirect_url}
              onChange={handleInputChange}
              placeholder="enter commition redirect url "
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              required
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              placeholder="enter site url"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
           
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="px-6 py-2 text-white bg-blue-500 rounded-lg shadow-lg" 
            >
              Submit
            </button>
          </div>
        </form>
      </div>



      <button type="button" onClick={getStore} className="text-base cursor-pointer text-blue-400">All Live Deals Partner</button>


{
  showList && <div>


<table className="min-w-full divide-y divide-gray-200 border border-gray-300">
  <thead className="bg-gray-100">
    <tr>
      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">URL</th>
      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Title</th>
      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Price</th>
      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Source</th>
      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Image</th>
      <th className="px-4 py-2 text-nowrap text-left text-sm font-medium text-gray-700">Redirect URL</th>
      <th className="px-4 py-2 text-left text-sm font-medium text-nowrap text-gray-700">Real Price</th>
      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Main Container</th>
      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Action</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-200 bg-white">
   {
    storeList.map((item , i)=>{
      return(
        <tr key={i}>
        <td className="px-4 py-2 text-sm text-nowrap text-gray-600">{item.url}</td>
        <td className="px-4 py-2 text-sm text-nowrap text-gray-600">{item.title}</td>
        <td className="px-4 py-2 text-sm text-nowrap text-gray-600">{item.price}</td>
        <td className="px-4 py-2 text-sm text-nowrap text-gray-600">{item.source}</td>
        <td className="px-4 py-2 text-sm text-nowrap text-gray-600">{item.image}</td>
        <td className="px-4 py-2 text-sm text-nowrap text-gray-600">{item.redirect_url}</td>
        <td className="px-4 py-2 text-sm text-nowrap text-gray-600">{item.real_price}</td>
        <td className="px-4 py-2 text-sm text-nowrap text-gray-600">{item.main_container}</td>
        <td className="px-4 py-2 text-sm text-nowrap text-gray-600">
        <button type="button" onClick={()=>delete_store(item._id)} className="text-base cursor-pointer text-blue-400">Remove</button>
        </td>
      </tr>
      )
    })
   }
  </tbody>
</table>


  </div>
}


    </>
  );
};

export default LiveDealStore;
