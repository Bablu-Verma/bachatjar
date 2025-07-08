"use client";

import { RootState } from "@/redux-store/redux_store";
import { clearSummary } from "@/redux-store/slice/cashbackSummary";
import { logout } from "@/redux-store/slice/userSlice";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface LayoutProps {
  children1: ReactNode;
}

export interface IUserI {
  name: string;
  email: string;
  role: string;
}

const DashboardUI: React.FC<LayoutProps> = ({ children1 }) => {
  const [activeSidebar, setActiveSidebar] = useState(true);

  const userI_data = useSelector(
    (state: RootState) => state.user.user
  ) as IUserI | null;

  const pathname = usePathname();
  const dispatch = useDispatch();

  const togelsidebar = () => {
    setActiveSidebar(!activeSidebar);
  };

  const _logOut = () => {
    setTimeout(() => {
      dispatch(logout());
      dispatch(clearSummary());
      window.location.href = "/login";
    }, 1000);
  };


  const url_path = [
    {
      id: 1,
      name: "Dashboard",
      url: "/dashboard",
      icon: "fas fa-tachometer-alt",
      roles: ["admin", "data_editor", "blog_editor"], 
    },
    {
      id: 2,
      name: "Add Product",
      url: "/dashboard/add-product",
      icon: "fas fa-tachometer-alt",
      roles: ["admin", "data_editor"], 
    },
    {
      id: 3,
      name: "All Product",
      url: "/dashboard/all-products",
      icon: "fas fa-tachometer-alt",
      roles: ["admin", "data_editor"],
    },
   
   
    {
      id: 4,
      name: "Add Category",
      url: "/dashboard/add-category",
      icon: "fas fa-tachometer-alt",
      roles: ["admin"]
    },
   
    {
      id: 5,
      name: "All Category",
      url: "/dashboard/all-category",
      icon: "fas fa-tachometer-alt",
      roles: ["admin", "data_editor"], 
    },
    {
      id: 6,
      name: "Add store",
      url: "/dashboard/add-store",
      icon: "fas fa-tachometer-alt",
      roles: ["admin"]
    },
   
    {
      id: 7,
      name: "All Stores",
      url: "/dashboard/all-stores",
      icon: "fas fa-tachometer-alt",
      roles: ["admin", "data_editor"], 
    },
   
    {
      id: 8,
      name: "Add coupons",
      url: "/dashboard/add-coupons",
      icon: "fas fa-tachometer-alt",
      roles: ["admin", 'data_editor']
    },
   
    {
      id:9,
      name: "All Coupons",
      url: "/dashboard/all-coupons",
      icon: "fas fa-tachometer-alt",
      roles: ["admin", "data_editor"], 
    },
   
    {
      id: 10,
      name: "Add Blog",
      url: "/dashboard/add-blog",
      icon: "fas fa-tachometer-alt",
      roles: ["admin", "blog_editor"], 
    },
    {
      id: 11,
      name: "Blog List",
      url: "/dashboard/blog-list",
      icon: "fas fa-tachometer-alt",
      roles: ["admin", "blog_editor"], 
    },
    {
      id: 12,
      name: "Add Blog Category",
      url: "/dashboard/add-blog-category",
      icon: "fas fa-tachometer-alt",
      roles: ["admin", "blog_editor"], 
    },
    {
      id: 13,
      name: " All Blog Category List",
      url: "/dashboard/blog-category-list",
      icon: "fas fa-tachometer-alt",
      roles: ["admin", "blog_editor"], 
    },
    {
      id: 14,
      name: "Order",
      url: "/dashboard/order",
      icon: "fas fa-tachometer-alt",
      roles: ["admin"], 
    },
    {
      id: 15,
      name: "Users",
      url: "/dashboard/all-user",
      icon: "fas fa-tachometer-alt",
      roles: ["admin"], 
    },
    {
      id: 16,
      name: "Contact Us Data",
      url: "/dashboard/contact-us/list",
      icon: "fas fa-tachometer-alt",
      roles: ["admin"], 
    },
    {
      id: 17,
      name: "UPI Id",
      url: "/dashboard/upi/upi-list",
      icon: "fas fa-tachometer-alt",
      roles: ["admin"], 
    },
    {
      id: 18,
      name: "Report",
      url: "/dashboard/add-report",
      icon: "fas fa-tachometer-alt",
      roles: ["admin"], 
    },
    {
      id: 19,
      name: "All withdrwal",
      url: "/dashboard/withdrwal",
      icon: "fas fa-tachometer-alt",
      roles: ["admin", ], 
    },
    {
      id: 20,
      name: "Claim form",
      url: "/dashboard/claim-form/list",
      icon: "fas fa-tachometer-alt",
      roles: ["admin", ], 
    },
    {
      id: 22,
      name: "Claim form tamplate",
      url: "/dashboard/claim-form-tamplate/add",
      icon: "fas fa-tachometer-alt",
      roles: ["admin", "data_editor"],
    },
     {
      id: 21,
      name: "Newsletter",
      url: "/dashboard/newsletter",
      icon: "fas fa-tachometer-alt",
      roles: ["admin", "data_editor"],
    },
    {
      id: 22,
      name: "Message Send",
      url: "/dashboard/message/send-message",
      icon: "fas fa-tachometer-alt",
      roles: ["admin", "data_editor"],
    },
     

    {
      id: 23,
      name: "image",
      url: "/dashboard/image",
      icon: "fas fa-tachometer-alt",
      roles: ["admin"], 
    },
   
  ];

  
  const filtered_url_path = url_path.filter((item) =>
    item.roles.includes(userI_data?.role || "")
  );

  return (
    <section className="h-screen w-[100%] max-w-[1400px] m-auto">
      <div className="flex justify-between">
        {activeSidebar && (
          <aside className={`${activeSidebar ? 'w-[300px]':'w-0'} duration-150 h-screen`}>
            <div className="overflow-y-auto max-h-screen">
              <h1 className="text-2xl font-semibold text-center text-secondary_color py-3 mb-3 select-none">
                <span className="text-primary capitalize">{userI_data?.role}</span>Board
              </h1>
              <div className="pb-10">
                <Link
                  href="/"
                  className="block mb-3 px-6 border-l-4 border-l-transparent hover:border-primary cursor-pointer duration-100 ease-in"
                >
                  <div className="px-5 py-2 rounded-lg">
                    <i className="fa-solid fa-link text-lg text-secondary_color"></i>
                    <span className="secondary_color text-sm font-normal ml-4">
                      Website
                    </span>
                  </div>
                </Link>
                {filtered_url_path.map((item, i) => {
                  if (item.url === pathname) {
                    return (
                      <div
                        key={i}
                        className="mb-3 px-6 border-l-4 border-primary cursor-pointer duration-100 ease-in"
                      >
                        <div className="bg-primary px-5 py-2 rounded-lg">
                          <i className={`${item.icon} text-lg text-light`}></i>
                          <span className="text-light text-sm font-normal ml-4">
                            {item.name}
                          </span>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <Link
                        href={item.url}
                        key={i}
                        className="block mb-3 px-6 border-l-4 border-l-transparent hover:border-primary cursor-pointer duration-100 ease-in"
                      >
                        <div className="px-5 py-2 rounded-lg">
                          <i className={`${item.icon} text-lg text-secondary_color`}></i>
                          <span className="secondary_color text-sm font-normal ml-4">
                            {item.name}
                          </span>
                        </div>
                      </Link>
                    );
                  }
                })}
                <button
                  onClick={_logOut}
                  className="px-6 border-l-4 border-l-transparent cursor-pointer duration-100 ease-in"
                >
                  <div className="px-5 py-2 rounded-lg">
                    <i className="fa-solid fa-power-off text-lg text-red-600"></i>
                    <span className="secondary_color text-sm font-normal ml-4">
                      Logout
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </aside>
        )}

        <div className={` px-2 w-auto`}>
          <header className="flex w-full justify-between items-center py-2 shadow-md">
            <button
              onClick={togelsidebar}
              className="p-3 rounded-full bg-white hover:bg-gray-100 duration-100 justify-center flex items-center"
            >
              <i className="fas fa-bars text-xl text-secondary_color"></i>
            </button>

            <h4
              title={userI_data?.email}
              className="text-sm capitalize cursor-pointer text-secondary_color font-semibold leading-normal"
            >
              {userI_data?.name}{" "}
              <span className="text-sm text-secondary_color font-normal leading-none">
                ({userI_data?.role})
              </span>
            </h4>
          </header>
          <div className={`h-[calc(100vh-4rem)] ${activeSidebar ? 'w-[1100px]':'w-[1400px]'}   overflow-y-auto  `}>
            {children1}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardUI;