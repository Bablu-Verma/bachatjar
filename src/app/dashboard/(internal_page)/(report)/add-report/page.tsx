"use client";

import { useState, } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { offline_report_add_api } from "@/utils/api_url";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import AddOfflineManualReport from "./ManualReport";


interface FailedRow {
  click_id: string;
  reason: string;
}

const AddOfflineReport = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState("");
  const [failedRows, setFailedRows] = useState<FailedRow[]>([]);

  const [uploadFiletype, setUploadFileType] = useState<string>("initial");

  const token = useSelector((state: RootState) => state.user.token);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a CSV file first.");
      return;
    }



    setLoading(true);
    setMessage("");
    setFailedRows([]);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("reporttype", uploadFiletype);


      const res = await axios.post(offline_report_add_api, formData, {
        headers: { "Content-Type": "multipart/form-data",
           Authorization: `Bearer ${token}`
         },
      });

      setMessage(res.data.message);
      toast.success(res.data.message || "File uploaded successfully.");
      setFile(null);
      setFailedRows(res.data.failedRows);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to upload file.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage("");
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const downloadFailedRowsAsCSV = () => {
    if (!failedRows.length) return;

    const headers = Object.keys(failedRows[0]).join(",") + "\n";
    const csvRows = failedRows
      .map(row => `${row.click_id},${row.reason}`)
      .join("\n");

    const csvContent = headers + csvRows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "failed_rows.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <h1 className="text-2xl py-2 font-medium text-secondary_color">Add Offline Report</h1>
      <div className="max-w-4xl my-10 mx-auto p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                disabled={loading}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

          
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <select
                value={uploadFiletype}
                onChange={(e) => setUploadFileType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none"
              >
                <option value="initial">initial</option>
                <option value="followup">followup</option>
              </select>
            </div>
          </div>

          <div className="text-right">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 text-white rounded-lg shadow-lg ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                }`}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>

        {message && <p className="text-green-500 text-sm py-4">{message}</p>}

        {failedRows.length > 0 && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Failed Rows</h2>
              <button
                onClick={downloadFailedRowsAsCSV}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
              >
                Download Failed Rows
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-md overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left px-4 py-2 border-b">Click ID</th>
                    <th className="text-left px-4 py-2 border-b">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {failedRows.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">{row.click_id}</td>
                      <td className="px-4 py-2 border-b">{row.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <AddOfflineManualReport />
    </>
  );
};

export default AddOfflineReport;
