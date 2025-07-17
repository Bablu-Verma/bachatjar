"use client";


import { contact_form_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    subject: "",
    message: "",
    name: "",
    address:''
  });

  const input_handle = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const SubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      toast.error("Email is required");
      return;
    }
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!formData.phone) {
      toast.error("Please enter Phone number");
      return;
    }
    if (formData.phone.length != 10) {
      toast.error("Please enter a valid Phone number");
      return;
    }
    if (!formData.name) {
      toast.error("Name is required");
      return;
    }
    if (!formData.subject) {
      toast.error("Please add your subject");
      return;
    }
    if (!formData.address) {
        toast.error("Please add your Full address");
        return;
      }
    if (!formData.message) {
      toast.error("Please add your message");
      return;
    }

    try {
        const {data} = await axios.post(contact_form_api,
          {
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            location:formData.address,
            phone_number:formData.phone,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          })
          
          toast.success(data.message);
          setFormData({
            email: "",
            phone: "",
            subject: "",
            message: "",
            name: "",
            address:''
          })
  
          
      } catch (error) {
          if (error instanceof AxiosError) { 
            console.error("Error registering user", error.response?.data.message);
            toast.error(error.response?.data.message);
          } else {
            console.error("Unknown error", error);
          }
      }
  };
  return (
    <form onSubmit={SubmitForm} className="col-span-3">
      <div className="grid  grid-rows-1 sm:grid-cols-3 gap-3 sm:gap-5 w-full mb-5">
        <div className="">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={input_handle}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
            placeholder="Your Email"
          />
        </div>
        <div className="">
          <label
            htmlFor="phone"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            maxLength={10}
            value={formData.phone}
            onChange={input_handle}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
            placeholder="Phone Number"
          />
        </div>
        <div className="">
          <label
            htmlFor="subject"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={input_handle}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
            placeholder="Name"
          />
        </div>
      </div>
      <div className="mb-5">
        <label
          htmlFor="subject"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={input_handle}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
          placeholder="Subject"
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="address"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Address
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={input_handle}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary"
          placeholder="Your Full Address"
        />
      </div>

      <textarea
        id="message"
        name="message"
        value={formData.message}
        onChange={input_handle}
        className="w-full px-3 py-2 text-sm border min-h-60 border-gray-300 rounded-md focus:outline-none focus:border-primary"
        placeholder="Your Message"
      ></textarea>
       
      <div className="flex justify-end w-full mt-4">
        <button
          type="submit"
          className="bg-primary text-white text-base font-medium duration-200 p-1.5 min-w-[150px] border-[1px] border-primary rounded shadow-sm hover:shadow-2xl"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
