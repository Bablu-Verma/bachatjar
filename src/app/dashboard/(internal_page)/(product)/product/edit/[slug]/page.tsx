"use client";

import { ICampaign } from "@/model/CampaignModel";
import { RootState } from "@/redux-store/redux_store";
import {
  product_edit_,

  product_dashboard_details_,
  category_list_dashboard_api,
  list_store_dashboard_api,
} from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import DateTimePicker from "react-datetime-picker";
import UploadImageGetLink from "@/app/dashboard/_components/Upload_image_get_link";
import TextEditor from "@/app/dashboard/_components/TextEditor";
import { IClintCampaign } from "../../../add-product/page";

const EditProduct = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const [productDetails, setProductDetails] = useState<ICampaign>();
  const [categoryList, setCategoryList] = useState<{ name: string; _id: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const pathname = usePathname();

  const [storeList, setStoreList] = useState<{ name: string; _id: string, store_type: string }[]>(
    []
  );
  const [editorT_and_c, setEditor_t_and_c] = useState("");
  const [editorContent, setEditorContent] = useState("");

  const [form_data, setForm_data] = useState<IClintCampaign>({
    title: "",
    actual_price: 0,
    offer_price: undefined, // add conditionally
    store: "",
    category: "",
    product_img: "",
    extrnal_url: '',
    product_tags: [],
    long_poster: [{ is_active: false, image: "" }],
    main_banner: [{ is_active: false, image: "" }],
    premium_product: [{ is_active: false, image: "" }],
    flash_sale: [{ is_active: false, image: "", end_time: null }],
    slug_type: "INTERNAL",

    product_status: "ACTIVE",
    description: "",
    t_and_c: "",
  });


  const urlslug = pathname.split("/").pop() || "";

  const GetData = async (slug: string) => {
    try {
      const { data } = await axios.post(
        product_dashboard_details_,
        {
          product_slug: slug,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setProductDetails(data.data);
      toast.success(data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error registering user", error.response?.data.message);
        toast.error(error.response?.data.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };

  useEffect(() => {
    if (urlslug) {
      GetData(urlslug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlslug]);

  useEffect(() => {
    if (productDetails) {

      setForm_data({
        title: productDetails.title || "",
        offer_price: productDetails.offer_price || 0,
        actual_price: productDetails.actual_price || 0,
        store: productDetails.store._id.toString(),
        category: productDetails.category._id.toString(),
        product_img: productDetails.product_img || '',
        product_tags: productDetails.product_tags || [],
        extrnal_url: productDetails.extrnal_url || '',
        long_poster: productDetails.long_poster || [
          { is_active: false, image: "" },
        ],
        main_banner: productDetails.main_banner || [
          { is_active: false, image: "" },
        ],
        premium_product: productDetails.premium_product || [
          { is_active: false, image: "" },
        ],
        flash_sale: productDetails.flash_sale
          ? productDetails.flash_sale.map((item) => ({
            ...item,
            end_time: item.end_time ? new Date(item.end_time) : null,
          }))
          : [
            { is_active: false, image: "", end_time: null },
          ],
        slug_type: productDetails.slug_type || "INTERNAL",

        product_status: (productDetails.product_status === "ACTIVE" || productDetails.product_status === "PAUSE")
          ? productDetails.product_status
          : "ACTIVE",
      });
    }

    setEditorContent(productDetails?.description || "some error");
    setEditor_t_and_c(productDetails?.t_and_c || "some error");
  }, [productDetails]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storeRes, categoryRes] = await Promise.all([
          axios.post(
            list_store_dashboard_api,
            { store_status: "ACTIVE" },
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.post(
            category_list_dashboard_api,
            { status: "ACTIVE" },
            { headers: { Authorization: `Bearer ${token}` } }
          ),
        ]);

        setStoreList(storeRes.data.data || []);
        setCategoryList(categoryRes.data.data || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [token]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, type, value, checked } = e.target as HTMLInputElement;
    setForm_data((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const requiredFields = [
        "title", "actual_price", "store", "category", "product_img", "product_status"
      ];

      const missingFields = requiredFields.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (field) => !(form_data as Record<string, any>)[field]
      );

      if (missingFields.length > 0) {
        toast.error(`${missingFields.join(", ")} is required.`);
        setLoading(false);
        return;
      }



      const formPayload = {
        ...form_data,
        _id: productDetails?._id,
        description: editorContent,
        t_and_c: editorT_and_c,
      };

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data } = await axios.post(
        product_edit_,
        JSON.stringify(formPayload),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Product update successfully!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "An error occurred");
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <h1 className="text-2xl py-2 font-medium text-secondary_color">
        Edit Product
      </h1>
      <div className="max-w-4xl my-10 mx-auto p-5 bg-white border border-gray-50 rounded-lg shadow-sm">
        <UploadImageGetLink />

        <h4 className="mb-3 text-base text-secondary select-none font-semibold">
          Product id: #{productDetails?._id}
        </h4>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={form_data.title}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="store"
                className="block text-sm font-medium text-gray-700"
              >
                Store Name
              </label>
              <select
                id="store"
                name="store"
                value={form_data.store}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              >
                <option value="" disabled selected>
                  Slected Store
                </option>
                {storeList.map((item, i) => {
                  return <option value={item._id} key={i}>{item.name} ({item.store_type})</option>;
                })}
              </select>
            </div>
            <div className="">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={form_data.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              >
                <option value="" disabled selected>
                  Select a category
                </option>
                {categoryList.map((item, i) => {
                  return (
                    <option key={i} value={item._id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="actual_price"
                className="block text-sm font-medium text-gray-700"
              >
                Actual Price
              </label>
              <input
                type="number"
                id="actual_price"
                name="actual_price"
                value={form_data.actual_price}
                onChange={handleChange}
                placeholder="Enter Actual product price"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="offer_price"
                className="block text-sm font-medium text-gray-700"
              >
                offer_price (if NON_INSENTIVE)*
              </label>
              <input
                type="number"
                id="offer_price"
                name="offer_price"
                value={form_data.offer_price}
                onChange={handleChange}
                placeholder="Enter Actual product price"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              />
            </div>
            <div>
              <label
                htmlFor="offer_price"
                className="block text-sm font-medium text-gray-700"
              >
                extrnal_url (if NON_INSENTIVE)*
              </label>
              <input
                type="text"
                id="extrnal_url"
                name="extrnal_url"
                value={form_data.extrnal_url}
                onChange={handleChange}
                placeholder="Enter Actual product price"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="product_tags"
                className="block text-sm font-medium text-gray-700"
              >
                Product tags - &quot;new&quot; | &quot;hot&quot; | &quot;best&quot;
              </label>
              <input
                type="text"
                name="product_tags"
                value={form_data.product_tags.join(", ")}
                onChange={(e) =>
                  setForm_data({
                    ...form_data,
                    product_tags: e.target.value.split(","),
                  })
                }
                placeholder="Product Tags Keywords (comma separated)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              />
            </div>
            <div className="">
              <label
                htmlFor="images"
                className="block text-sm font-medium text-gray-700"
              >
                Product Images
              </label>
              <input
                type="text"
                id="images"
                placeholder="add your image link"
                name="product_img"
                value={form_data.product_img}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="long_poster"
                className="block text-sm font-medium text-gray-700"
              >
                Long Poster
              </label>
              <input
                type="radio"
                id="long_posterYes"
                name="long_poster"
                checked={form_data.long_poster[0].is_active}
                onChange={() =>
                  setForm_data((prev) => ({
                    ...prev,
                    long_poster: [{ ...prev.long_poster[0], is_active: true }],
                  }))
                }
                value="Yes"
              />
              <label className="px-4" htmlFor="long_posterYes">
                Yes
              </label>

              {/* No Radio */}
              <input
                type="radio"
                id="long_posterNo"
                name="long_poster"
                value="No"
                checked={!form_data.long_poster[0].is_active}
                onChange={() =>
                  setForm_data((prev) => ({
                    ...prev,
                    long_poster: [
                      { ...prev.long_poster[0], is_active: false, image: "" },
                    ],
                  }))
                }
              />
              <label htmlFor="long_posterNo">No</label>

              {/* Image Input (Visible only if Yes is selected) */}
              {form_data.long_poster[0].is_active && (
                <input
                  type="text"
                  name="long_poster_image"
                  value={form_data.long_poster[0].image}
                  onChange={(e) =>
                    setForm_data((prev) => ({
                      ...prev,
                      long_poster: [
                        { ...prev.long_poster[0], image: e.target.value },
                      ],
                    }))
                  }
                  placeholder="Enter Long Poster Image Link"
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                />
              )}
            </div>

            {/* Main Banner Section */}
            <div>
              <label
                htmlFor="main_banner"
                className="block text-sm font-medium text-gray-700"
              >
                Main Banner
              </label>
              {/* Yes Radio */}
              <input
                type="radio"
                id="main_bannerYes"
                name="main_banner"
                checked={form_data.main_banner[0].is_active}
                onChange={() =>
                  setForm_data((prev) => ({
                    ...prev,
                    main_banner: [{ ...prev.main_banner[0], is_active: true }],
                  }))
                }
                value="Yes"
              />
              <label className="px-4" htmlFor="main_bannerYes">
                Yes
              </label>

              {/* No Radio */}
              <input
                type="radio"
                id="main_bannerNo"
                name="main_banner"
                value="No"
                checked={!form_data.main_banner[0].is_active}
                onChange={() =>
                  setForm_data((prev) => ({
                    ...prev,
                    main_banner: [
                      { ...prev.main_banner[0], is_active: false, image: "" },
                    ],
                  }))
                }
              />
              <label htmlFor="main_bannerNo">No</label>

              {/* Image Input (Visible only if Yes is selected) */}
              {form_data.main_banner[0].is_active && (
                <input
                  type="text"
                  name="main_banner_image"
                  value={form_data.main_banner[0].image}
                  onChange={(e) =>
                    setForm_data((prev) => ({
                      ...prev,
                      main_banner: [
                        { ...prev.main_banner[0], image: e.target.value },
                      ],
                    }))
                  }
                  placeholder="Enter Main Banner Image Link"
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="premium_product"
                className="block text-sm font-medium text-gray-700"
              >
                Premium Product
              </label>
              <input
                type="radio"
                id="premium_productYes"
                name="premium_product"
                checked={form_data.premium_product[0].is_active}
                onChange={() =>
                  setForm_data((prev) => ({
                    ...prev,
                    premium_product: [
                      { ...prev.premium_product[0], is_active: true },
                    ],
                  }))
                }
                value="Yes"
              />
              <label className="px-4" htmlFor="premium_productYes">
                Yes
              </label>

              <input
                type="radio"
                id="premium_productNo"
                name="premium_product"
                value="No"
                checked={!form_data.premium_product[0].is_active}
                onChange={() =>
                  setForm_data((prev) => ({
                    ...prev,
                    premium_product: [
                      {
                        ...prev.premium_product[0],
                        is_active: false,
                        image: "",
                      },
                    ],
                  }))
                }
              />
              <label htmlFor="premium_productNo">No</label>

              {form_data.premium_product[0].is_active && (
                <input
                  type="text"
                  name="premium_product_image"
                  value={form_data.premium_product[0].image}
                  onChange={(e) =>
                    setForm_data((prev) => ({
                      ...prev,
                      premium_product: [
                        { ...prev.premium_product[0], image: e.target.value },
                      ],
                    }))
                  }
                  placeholder="Enter Premium Product Image Link"
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                />
              )}
            </div>

            {/* Flash Sale Section */}
            <div>
              <label
                htmlFor="flash_sale"
                className="block text-sm font-medium text-gray-700"
              >
                Flash Sale
              </label>
              <input
                type="radio"
                id="flash_saleYes"
                name="flash_sale"
                checked={form_data.flash_sale[0].is_active}
                onChange={() =>
                  setForm_data((prev) => ({
                    ...prev,
                    flash_sale: [{ ...prev.flash_sale[0], is_active: true }],
                  }))
                }
                value="Yes"
              />
              <label className="px-4" htmlFor="flash_saleYes">
                Yes
              </label>

              <input
                type="radio"
                id="flash_saleNo"
                name="flash_sale"
                value="No"
                checked={!form_data.flash_sale[0].is_active}
                onChange={() =>
                  setForm_data((prev) => ({
                    ...prev,
                    flash_sale: [
                      {
                        ...prev.flash_sale[0],
                        is_active: false,
                        image: "",
                        end_time: null,
                      },
                    ],
                  }))
                }
              />
              <label htmlFor="flash_saleNo">No</label>

              {form_data.flash_sale[0].is_active && (
                <>
                  <input
                    type="text"
                    name="flash_sale_image"
                    value={form_data.flash_sale[0].image}
                    onChange={(e) =>
                      setForm_data((prev) => ({
                        ...prev,
                        flash_sale: [
                          { ...prev.flash_sale[0], image: e.target.value },
                        ],
                      }))
                    }
                    placeholder="Enter Flash Sale Image Link"
                    className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
                  />
                  <DateTimePicker
                    format="dd-MM-yyyy HH:mm:ss"
                    onChange={(date) =>
                      setForm_data((prev) => ({
                        ...prev,
                        flash_sale: [
                          {
                            ...prev.flash_sale[0],
                            end_time: date ?? new Date(),
                          },
                        ],
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
                    value={
                      form_data.flash_sale[0].end_time
                        ? new Date(form_data.flash_sale[0].end_time) // Convert string to Date
                        : new Date() // Default value
                    }
                  />
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="slug_type"
                className="block text-sm font-medium text-gray-700"
              >
                Slug type
              </label>
              <select
                id="slug_type"
                name="slug_type"
                value={form_data.slug_type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              >
                <option value="" disabled selected>
                  slug_type
                </option>
                <option value="INTERNAL">INTERNAL</option>
                <option value="EXTERNAL">EXTERNAL</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="product_status"
                className="block text-sm font-medium text-gray-700"
              >
                Product status
              </label>
              <select
                id="product_status"
                name="product_status"
                value={form_data.product_status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none "
              >
                <option value="" disabled selected>
                  product_status
                </option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="PAUSE">PAUSE</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor=""
              className="block text-sm font-medium text-gray-700"
            >
              Product description
            </label>
            <TextEditor
              editorContent={editorContent}
              setEditorContent={setEditorContent}
            />
          </div>
          <div>
            <label
              htmlFor=""
              className="block text-sm font-medium text-gray-700"
            >
              Tream and condition
            </label>
            <TextEditor
              editorContent={editorT_and_c}
              setEditorContent={setEditor_t_and_c}
            />
          </div>











          <div className="text-right pt-20">
            <button
              type="reset"
              onClick={() => window.location.reload()}
              className="px-6 py-2 text-red-500 rounded-lg shadow-lg font-medium focus:outline-none  mr-6"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none "
            >
              {loading ? "On Process" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProduct;
