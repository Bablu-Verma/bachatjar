"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { live_deal_add_admin_api, live_dealdeletemany_list_admin_api, scraper_live_deal_admin_api } from "@/utils/api_url";
import UploadImageGetLink from "../../_components/Upload_image_get_link";
import Link from "next/link";


const LiveDeal = () => {

    const token = useSelector((state: RootState) => state.user.token);
    const [scrape_loading, setScrapeLoading] = useState(false)

    const [formData, setFormData] = useState({
      title:'',
      price:"",
      source:"",
      client_id:'',
      image:"",
      real_price:'',
      });


    const scrapDeal = async () => {
        setScrapeLoading(true)
        try {
          const { data } = await axios.post(
            scraper_live_deal_admin_api,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(data)
        } catch (error) {
          if (error instanceof AxiosError) {
            console.error("Error ", error.response?.data.message);
            toast.error(error.response?.data.message);
          } else {
            console.error("Unknown error", error);
          }
        }finally{
            setScrapeLoading(false)
        }
      };


        const handleInputChange = (
          e: React.ChangeEvent<HTMLInputElement>
        ) => {
          const { name, value } = e.target;
        
          setFormData((prev) => ({ ...prev, [name]: value }));
        };

        const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
      
        
      
          try {
            const { data } = await axios.post(
              live_deal_add_admin_api,
              {
               ...formData
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
      
            toast.success(data.message);
           
          } catch (error) {
            if (error instanceof AxiosError) {
              toast.error(error.response?.data?.message || "Something went wrong");
            } else {
              console.error("Unknown error", error);
            }
          } 
        };


          const delete_deal = async ()=>{
              try {
                const { data } = await axios.post(
                  live_dealdeletemany_list_admin_api, 
                  {
                    
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                toast.success(data.message || 'Delete sucess');
              
              } catch (error) {
                if (error instanceof AxiosError) {
                  console.error("Error ", error.response?.data.message);
                  toast.error(error.response?.data.message);
                } else {
                  console.error("Unknown error", error);
                }
              }
            }

  return (
    <>
     <div className="p-6">
    <button type="button" className="bg-green-500 w-[200px] py-2 border-2 border-green-400 rounded-lg px-5 text-secondary" onClick={scrapDeal}>{scrape_loading ?'Loading': "Scrape Live Deal"}</button>
    </div>
  
    <div className="pt-8 bt-2">
      <h1 className="text-2xl py-2 font-medium text-secondary_color">
        Add Live Deals   <span className="text-base inline-block ml-20 underline text-blue-400 cursor-pointer"><Link href={`/dashboard/livedeal/all`}>All Live Deals</Link></span>
        <span className="text-base inline-block ml-20 underline text-blue-400 cursor-pointer"><button type="button" onClick={delete_deal}>Delete 10 items</button></span>
      </h1>
      <div className="max-w-4xl my-10 mx-auto p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <UploadImageGetLink />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="title"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
             Image URL
            </label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="image url"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
           
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
             price
            </label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="price"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
           
          </div>

         
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
            real_price
            </label>
            <input
              type="text"
              name="real_price"
              value={formData.real_price}
              onChange={handleInputChange}
              placeholder="real price"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
           
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
            Store name
            </label>
            <input
              type="text"
              name="source"
              value={formData.source}
              onChange={handleInputChange}
              placeholder="Store name"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
           
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
            redirect url
            </label>
            <input
              type="text"
              name="client_id"
              value={formData.client_id}
              onChange={handleInputChange}
              placeholder="redirect url / commition url"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            />
           
          </div>

         

          
          <div className="text-right">
            <button
              type="reset"
              className="px-6 py-2 text-red-500 rounded-lg shadow-lg font-medium focus:ring-2 focus:ring-red-500 mr-6"
              onClick={() => window.location.reload()}
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
             
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
   
  );
};

export default LiveDeal;
