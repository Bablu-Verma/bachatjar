"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import toast from "react-hot-toast";
import axios from "axios";
import { claim_form_tamp_add_api } from "@/utils/api_url";
import Link from "next/link";



const FIELD_TYPES = ["text", "number", "date", "file"];

const AddClaimFormTemplate = () => {
  const token = useSelector((state: RootState) => state.user.token);

  const [store, setStore] = useState("");
  const [fields, setFields] = useState([
    { label: "", type: "text", required: false },
  ]);
  const [loading, setLoading] = useState(false);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleFieldChange = (index: number, key: string, value: any) => {
  const updatedFields = [...fields];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (updatedFields[index] as any)[key] = value;
  setFields(updatedFields);
};

  const addField = () => {
    setFields([...fields, { label: "", type: "text", required: false }]);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!store) return toast.error("Please select a store");
    if (fields.length === 0) return toast.error("At least one field is required");
  

    console.log(store, fields)

    try {
      setLoading(true);
      const res = await axios.post(
        claim_form_tamp_add_api, 
        { store, fields },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);
      setTimeout(() => window.location.reload(), 1500);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error creating template");
    } finally {
      setLoading(false);
    }
  };

  return (
   <>
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white rounded-lg border shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Create Claim Form Template</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium text-gray-700">Select Store</label>
           <input
              type="text"
              value={store}
              onChange={(e) => setStore(e.target.value)}
              placeholder="Enter store ObjectId"
              className="w-full border px-4 py-2 rounded-lg"
            />
        </div>

        <div>
          <h3 className="font-medium text-gray-800 mb-2">Form Fields</h3>
          {fields.map((field, index) => (
            <div key={index} className="border p-4 mb-4 rounded-md space-y-3 bg-gray-50 relative">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Field Label"
                  value={field.label}
                  onChange={(e) => handleFieldChange(index, "label", e.target.value)}
                  className="border px-3 py-2 rounded-md w-full"
                />

                <select
                  value={field.type}
                  onChange={(e) => handleFieldChange(index, "type", e.target.value)}
                  className="border px-3 py-2 rounded-md w-full"
                >
                  {FIELD_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                <select
                  value={field.required ? "true" : "false"}
                  onChange={(e) =>
                    handleFieldChange(index, "required", e.target.value === "true")
                  }
                  className="border px-3 py-2 rounded-md w-full"
                >
                  <option value="false">Optional</option>
                  <option value="true">Required</option>
                </select>
              </div>

              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeField(index)}
                  className="absolute top-2 right-2 text-red-500 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addField}
            className="px-4 py-2 mt-2 bg-blue-100 text-blue-700 rounded-md text-sm"
          >
            + Add Field
          </button>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Creating..." : "Submit Template"}
          </button>
        </div>
      </form>
    </div>
    <div className="text-center text-blue-500 hover:underline text-lg py-8">
      <Link href='/dashboard/claim-form-tamplate/list'>Claim tamplate list</Link>
    </div>
   
   </>
  );
};

export default AddClaimFormTemplate;
