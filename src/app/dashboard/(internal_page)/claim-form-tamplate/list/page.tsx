"use client";

import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { claim_form_tamp_delete_api, claim_form_tamp_list_api } from "@/utils/api_url";


// Example API endpoint

interface IClaimField {
  label: string;
  type: "text" | "number" | "date" | "file";
  required: boolean;
  options?: string[];
}

interface IClaimFormTemplate {
  _id: string;
  store: {
    _id: string;
    name: string;
  };
  fields: IClaimField[];
}

const TemplateList = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const [templates, setTemplates] = useState<IClaimFormTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  const getTemplates = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(claim_form_tamp_list_api, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTemplates(data.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to load templates");
      } else {
        console.error("Unknown error", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTemplates();
  }, []);


  const handleDelete = async (templateId: string) => {
    const confirm = window.confirm("Are you sure you want to delete this template?");
    if (!confirm) return;

    try {
      const res = await axios.post(claim_form_tamp_delete_api,{templateId:templateId}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res.data.message || "Template deleted successfully");

      // Refresh template list
      getTemplates();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to delete template");
      } else {
        toast.error("Unknown error occurred");
        console.error(error);
      }
    }
  };





  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4 text-secondary_color">Claim Form Templates</h1>

      {loading ? (
        <p>Loading templates...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border bg-white">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3 border-b">S no.</th>
                <th className="p-3 border-b">Store Name</th>
                <th className="p-3 border-b">Total Fields</th>
                <th className="p-3 border-b">Fields Detail</th>
                <th className="p-3 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template, i) => (
                <tr key={template._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">
                    {i + 1}
                  </td>
                  <td className="p-3 border-b">
                    {template.store.name} <br />
                    {template.store._id}
                  </td>
                  <td className="p-3 border-b">{template.fields.length}</td>
                  <td className="p-3 border-b">
                    <ul className="list-disc ml-5 text-sm">
                      {template.fields.map((field, idx) => (
                        <li key={idx}>
                          <strong>{field.label}</strong> ({field.type})
                          {field.required && <span className="text-red-500"> *</span>}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-3 border-b">
                    <button onClick={() => handleDelete(template._id)}
                      className="text-red-600 hover:underline text-sm" type="button">Delete Tamplate</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TemplateList;
