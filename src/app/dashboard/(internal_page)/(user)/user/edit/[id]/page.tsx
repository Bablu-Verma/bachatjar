"use client";

import { RootState } from "@/redux-store/redux_store";
import {
  users_detail_edit_by_admin,
  users_edit_details_admin,
} from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import DateTimePicker from "react-datetime-picker";
import { usePathname } from "next/navigation";
import UploadImageGetLink from "@/app/dashboard/_components/Upload_image_get_link";

const ProfileEdit = () => {
  const token = useSelector((state: RootState) => state.user.token);

  const pathname = usePathname();

  const urlslug = pathname.split("/").pop() || "";

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    profileImage: '',
    dob: new Date(),
    gender: "",
    email:'',
    subscribe_email: "",
    user_status: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);

  const getuserdetail = async () => {
    try {
      const { data } = await axios.post(
        users_edit_details_admin,
        { email: urlslug },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFormData({
        name: data.data.name,
        phone: data.data.phone,
        profileImage: data.data.profile || "",
        dob: data.data.dob,
        gender: data.data.gender,
        subscribe_email:  data.data.subscribe_email,
        user_status: data.data.user_status,
        role: data.data.role,
        email:data.data.email
      })


    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Error fetching category");
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  useEffect(() => {
    getuserdetail();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value, 
    }));
  };


  const call_db = async () => {
    setLoading(true);

    console.log(formData)

    try {
      const { data } = await axios.post(
        users_detail_edit_by_admin,
        {
          email:formData.email,
          name: formData.name,
          phone: formData.phone,
          profileImage: formData.profileImage,
          dob: formData.dob,
          gender: formData.gender,
          subscribe_email:  formData.subscribe_email,
          user_status: formData.user_status,
          role: formData.role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error edit user", error.response?.data.message);
        toast.error(error.response?.data.message);
      } else {
        console.error("Unknown error", error);
      }
    } finally {
      setLoading(false);
    }
  };


  

  return (
    <>
      <h3 className="font-semibold mb-4 text-center lg:text-left text-xl sm:text-2xl text-primary">
        Edit user Profile
      </h3>
      <div className="max-w-[600px] m-auto">
        <UploadImageGetLink />
        <form  onSubmit={(e) => {
            e.preventDefault();
            call_db();
          }}>
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
          <div className="mb-3">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              readOnly
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              profileImage
            </label>
            <input
              type="text"
              name="profileImage"
              onChange={handleChange}
              value={formData.profileImage}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              subscribe_email
            </label>
            <input
              type="text"
              name="subscribe_email"
              value={formData?.subscribe_email}
              placeholder="subscribe_email"
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
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

          <div className="flex col-span-2 gap-3 lg:justify-between mb-5 ">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                user Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 min-w-[200px] border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              >
                <option disabled value="">
                  Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="flex col-span-2 gap-3 lg:justify-between mb-5 ">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                user role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className=" w-[250px] px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="admin">admin</option>
                <option value="data_editor">blog_editor</option>
                <option value="blog_editor">blog_editor</option>
                <option value="user">user</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                user_status
              </label>
              <select
                name="user_status"
                value={formData.user_status}
                onChange={handleChange}
                className=" px-4 w-[250px] py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="REMOVED">REMOVED</option>
              </select>
            </div>
          </div>
          <div className="flex justify-evenly lg:justify-end gap-10 my-10">
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

export default ProfileEdit;
