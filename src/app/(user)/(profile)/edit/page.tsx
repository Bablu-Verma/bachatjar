"use client";

import { IUserAddress } from "@/common_type";
import { IUser } from "@/model/UserModel";
import { RootState } from "@/redux-store/redux_store";
import { login } from "@/redux-store/slice/userSlice";
import { edit_profile_api, edit_user_address_api, user_profile_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import DateTimePicker from "react-datetime-picker";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
  import { useCallback } from "react";

interface AddressFormData {
  house_no: string;
  landmark: string;
  street: string;
  area: string;
  city_village: string;
  state: string;
  pincode: string;
  country: string;
}

interface IFormData {
  name: string;
  phone: string;
  profileImage: File | null;
  dob: Date;
  gender: string;
}

const EditUserDetails:React.FC = ()=>{
 const [openAddress, setOpenAddress] = useState(false)

  return(
    <>
    
    <ProfileEdit />


    <div className="py-5 ">
      <button className="text-blue-400 text-base hover:text-primary duration-200" onClick={()=>{setOpenAddress(!openAddress)}}>
        {
          openAddress ?'Close Address Tab':'Edit Address'
        }
        </button>
    </div>
    {
      openAddress &&  <UserAddress />
    }
   
    </>
   
  )

}

export default  EditUserDetails


const ProfileEdit : React.FC= () => {
  const token = useSelector((state: RootState) => state.user.token);
  const user = useSelector(
    (state: RootState) => state.user.user
  ) as IUser | null;
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<IFormData>({
    name: "",
    phone: "",
    profileImage: null,
    dob: new Date(),
    gender: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        profileImage: null,
        dob: user.dob ? new Date(user.dob) : new Date(),
        gender: user.gender || "",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "profileImage" && files ? files[0] : value,
    }));
  };



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fdata = new FormData();
    fdata.append("name", formData.name);
    fdata.append("phone", formData.phone);
    fdata.append("dob", formData.dob.toISOString());
    fdata.append("gender", formData.gender);
    if (formData.profileImage) {
      fdata.append("profile", formData.profileImage);
    }
    call_db(fdata);
  };

  const call_db = async (fdata: FormData) => {
    console.log("fdata_ client call", fdata);
    setLoading(true);
    try {
      const { data } = await axios.post(edit_profile_api, fdata, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(data.message);
      dispatch(login({ user: data.data, token: token || "" }));
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error login user", error.response?.data.message);
        toast.error(error.response?.data.message);
      } else {
        console.error("Unknown error", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.reload();
  };

  return (
    <>
      <h3 className="font-semibold mb-4 text-center lg:text-left text-xl sm:text-2xl text-primary">
        Edit Your Profile
      </h3>
      <div className="max-w-[600px] m-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-3 justify-center items-center flex">
            <label
              htmlFor="user_profile"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              <Image
                src={
                  formData.profileImage
                    ? URL.createObjectURL(formData.profileImage)
                    : user?.profile ||
                      "https://cdn-icons-png.flaticon.com/512/9203/9203764.png"
                }
                height={100}
                width={100}
                sizes="100vw"
                alt="Profile"
                className="max-w-[100px] max-h-[100px] rounded-full"
              />
            </label>
            <input
              type="file"
              id="user_profile"
              name="profileImage"
              className="hidden"
              onChange={handleChange}
              accept="image/*"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              name="email"
              value={user?.email}
              readOnly
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
              placeholder="John Doe"
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
              placeholder="Phone"
            />
          </div>

          <div className="flex flex-col gap-3 lg:justify-between mb-5 ">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Date of Birth
              </label>
            
              <DateTimePicker
                disableClock={true}
                format="dd-MM-yyyy"
                onChange={(date: Date | null) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    dob: date ?? new Date(),
                  }))
                }
                className=" text-sm border border-gray-300 w-[160px] rounded-md focus:outline-none focus:border-primary" 
                clearIcon={null}
                value={formData.dob}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Gender
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-0"
                  />
                  <span className="text-sm">Male</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-0"
                  />
                  <span className="text-sm">Female</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    checked={formData.gender === "other"}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-0"
                  />
                  <span className="text-sm">Other</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-evenly lg:justify-end gap-10 my-10">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-white text-gray-800 text-base font-normal border-[1px] border-primary rounded duration-200 p-2 min-w-[120px] md:min-w-[150px] px-10 hover:text-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`bg-primary text-white text-base font-medium duration-200 p-1.5 min-w-[120px] md:min-w-[150px] border-[1px] border-primary rounded shadow-sm hover:shadow-2xl ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Wait..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};


const UserAddress: React.FC = () => {
  const [formData, setFormData] = useState<AddressFormData>({
    house_no: "",
    landmark: "",
    street: "",
    area: "",
    city_village: "",
    state: "",
    pincode: "",
    country: "",
  });

  const [loading, setLoading] = useState(false);
  const token = useSelector((state: RootState) => state.user.token);
  const [user_address, setUser_address] = useState<IUserAddress>({
    house_no: "",
    landmark: "",
    street: "",
    area: "",
    city_village: "",
    state: "",
    pincode: "",
    country: "",
  });

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.house_no) {
      toast.error("Add house number/name");
      return;
    }
    if (!formData.landmark) {
      toast.error("Add your landmark");
      return;
    }
    if (!formData.city_village) {
      toast.error("Add your Village/City name");
      return;
    }
    if (!formData.state) {
      toast.error("Add your State");
      return;
    }
    if (!formData.pincode) {
      toast.error("Add area Pincode");
      return;
    }
    if (!formData.country) {
      toast.error("Add your Country");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        edit_user_address_api,
        {
          house_no: formData.house_no,
          landmark: formData.landmark,
          street: formData.street,
          area: formData.area,
          city_village: formData.city_village,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country,
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
        console.error("Error ", error.response?.data.message);
        toast.error(error.response?.data.message);
      } else {
        console.error("Unknown error", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const cancle_ = () => {
    window.location.reload();
  };



  const getaddress = useCallback(async () => {
    try {
      const { data } = await axios.post(
        user_profile_api,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUser_address(data.data.address);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error user", error.response?.data.message);
        toast.error(error.response?.data.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  }, [token]);

  useEffect(() => {
    getaddress();
  }, [getaddress]);

  useEffect(() => {
    if (user_address) {
      setFormData({
        house_no: user_address.house_no || "",
        landmark: user_address.landmark || "",
        street: user_address.street || "",
        area: user_address.area || "",
        city_village: user_address.city_village || "",
        state: user_address.state || "",
        pincode: user_address.pincode || "",
        country: user_address.country || "",
      });
    }
  }, [user_address]);

  return (
    <>
      <h3 className="font-semibold mb-4 text-2xl text-primary">Your Address</h3>
      <div className="max-w-[600px] m-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              House No./Name*
            </label>
            <input
              type="text"
              name="house_no"
              value={formData.house_no}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
              placeholder="Enter house number"
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Landmark*
            </label>
            <input
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
              placeholder="Enter landmark"
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Street
            </label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
              placeholder="Enter street"
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Area
            </label>
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
              placeholder="Enter area"
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              City/Village*
            </label>
            <input
              type="text"
              name="city_village"
              value={formData.city_village}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
              placeholder="Enter city / village"
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              State*
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
              placeholder="Enter state"
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Pincode*
            </label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
              placeholder="Enter pincode"
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Country*
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
              placeholder="Enter country"
            />
          </div>
          <div className="flex justify-end gap-10 my-10">
            <button
              type="button"
              onClick={cancle_}
              className="bg-white text-gray-800 text-base font-normal duration-200 p-2 px-10 hover:text-primary"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="bg-primary text-white text-base font-medium duration-200 p-1.5 min-w-[150px] border-[1px] border-primary rounded shadow-sm hover:shadow-2xl"
            >
              {loading ? "Wait.." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};


