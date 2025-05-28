/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import { formatDate } from "@/helpers/client/client_function";
import { RootState } from "@/redux-store/redux_store";
import { withdraw_list_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import { IoMdTime } from "react-icons/io";


export default function OrderListPage() {
  const [withdrawalList, setWithdrawalList] = useState<any[]>([]);
  const [sheet, setSheet] = useState({ show: false, details: {} as any });
  const token = useSelector((state: RootState) => state.user.token);
  
  
  const [showPaymentHistory, setShowPaymentHistory] = useState(true);
  const [page, setPage] = useState(1)
  const [activeTab, setActiveTab] = useState('')

  const get_order = async () => {
    try {
      const { data } = await axios.post(
        withdraw_list_api,
        { page: page, status: activeTab },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(data.data)
      setWithdrawalList([...withdrawalList, ...data.data]);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "An error occurred");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  useEffect(() => {
    get_order();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page,activeTab]);

  const tab = [
   
    {
      id: 1,
      name: 'Pending',
      click: 'PENDING'
    },
    {
      id: 2,
      name: 'Approved',
      click: 'APPROVED'
    },
    {
      id: 3,
      name: 'Rejected',
      click: 'REJECTED'
    }
  ]

  return (
    <>
      <MainHeader />
      <main>
        <div className="max-w-6xl mx-auto px-4 mt-7 md:mt-10 mb-10">
          <h1 className="text-2xl font-bold mb-6">Withdrawal</h1>

          <div className=" flex justify-start items-center gap-4 mb-6">
            <span className="text-sm text-nowrap text-secondary"> Status:</span>    {
              tab.map((item, i) => {
                return (
                  <button className={`text-sm py-1 px-4 sm:px-6 transition-all duration-300 ease-in-out rounded-full border-2 ${activeTab === item.click ? "text-primary border-primary" : "text-secondary border-secondary"
                    }`} key={i} onClick={() => {
                      setActiveTab(item.click)
                      setPage(1)
                      setWithdrawalList([])
                    }}>{item.name}</button>
                )
              })
            }
          </div>

          {withdrawalList.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No withdrawal found.</div>
          ) : (
            <div className=" bg-white p-4 rounded-lg md:p-8">
              {withdrawalList.map((item, i) => (
                <div key={i} className="px-4 py-2 shadow-sm md:px-5 md:py-3 border-[1px] border-primary rounded-3xl mb-5" >
                  <p className="text-secondary"><span className='capitalize font-medium'>UPI: </span>{item.upi_id || "-"}</p>
                  <div className="flex justify-between pt-2 items-start">
                    <div>
                      <h3 className="text-base text-secondary"><span className="text-sm m">Status:</span> {item.status}</h3>
                      <button type="button" title="Click to Details" className="text-sm text-blue-400 hover:underline" onClick={() => setSheet({ show: true, details: item })} >More Details</button>
                    </div>
                    <div className='text-right'>
                      <p className="text-base text-secondary">Amount:</p>
                      <h4 className="text-xl font-medium text-secondary ">₹{item.amount ?? 0}</h4>
                      <p className="text-sm text-secondary">{formatDate(item.createdAt)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-center items-center py-10">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="text-sm py-2 px-8 transition-all duration-300 ease-in-out rounded-full border-2 border-primary hover:border-white text-white bg-primary"
          >
            More Order
          </button>
        </div>
        <BottomToTop />
      </main>
      <Footer />

      {/* Sheet Modal */}
      {sheet.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl relative p-6 animate-slideUp">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 rounded-full p-1"
              onClick={() => setSheet({ show: false, details: {} })}
            >
              <IoClose className="text-xl text-gray-600 hover:text-black" />
            </button>

            {/* Title */}
            <h2 className="text-lg font-semibold text-secondary mb-6 text-left">Withdrawal Details</h2>

            <div className="border-[1px] border-dashed border-secondary p-4 rounded-lg">
              <h4 className="text-black  text-base"><span className="font-medium text-secondary inline-block mr-2 text-sm">UPI:</span> {sheet.details.upi_id}</h4>
              <div className="flex mt-3 justify-between items-start">
                <div>
                
                
                  <h2><span className="text-sm mr-3 mb-1 inline-block">Status</span><span className="text-secondary">{sheet.details.status ? sheet.details.status : '-'}</span></h2>
                
                </div>
                <div className="text-right">
                  <p className="mb-1"><span className="block text-base text-secondary">Amount:</span> <span className="text-secondary text-lg font-medium">{sheet.details.amount ? `₹ ${sheet.details.amount}` : " ₹0"}</span></p>
                 
                  <p className="text-sm flex text-secondary items-center gap-2 mt-4"><IoMdTime className="text-base" /> <span>{formatDate(sheet.details.createdAt)}</span></p>
                </div>
              </div>
            </div>


            <div className="space-y-5">

              <div className="flex mt-5 gap-4 ">

                {sheet.details.status && sheet.details.history.length > 0 && (
                  <button
                    type="button"
                    className="text-sm cursor-pointer  text-blue-800  font-normal"
                    onClick={() => {
                    
                      setShowPaymentHistory(true)
                    }}
                  >
                    Status History
                  </button>

                )}
              </div>

          
              {showPaymentHistory && (
                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full text-sm border">
                    <thead className="bg-green-100">
                      <tr>
                        <th className="text-left p-3 border-b">Details</th>
                        <th className="text-left p-3 border-b">Date</th>
                        <th className="text-left p-3 border-b">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sheet.details.history.map((payment:any, idx:number) => (
                        <tr key={idx} className="hover:bg-green-50">
                          <td className="p-3 border-b">{payment.details || "-"}</td>
                          <td className="p-3 border-b">{formatDate(payment.date)}</td>
                          <td className="p-3 border-b">{payment.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}

