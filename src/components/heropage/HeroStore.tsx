
import { IStore } from "@/model/StoreModel";
import Link from "next/link";
import React from "react";

interface HeroStoreProps{
  store: IStore[];
}
const HeroStore:React.FC<HeroStoreProps> = ({store}) => {
  return (
    <div className="px-4 py-2 bg-white rounded hidden lg:block col-span-1">
      <ul>
        {
          store.slice(0,6).map((item, i)=>{
            return(
              <li className="py-1" key={i}>
              <Link
                href={`/store/${item.slug}`}
                className="text-gray-700 font-normal capitalize duration-200 hover:text-gray-900 hover:pl-2 hover:font-medium"
              >
                {item.name}
              </Link>
            </li>
            )
          })
        }
      
        <li className="py-1">
          <Link
            href="/store"
            className="text-primary font-normal duration-200 hover:text-gray-900 hover:pl-2 hover:font-medium"
          >
          <i className="fa-solid fa-angle-right"></i> All Store
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default HeroStore;
