"use client";

import { RootState } from "@/redux-store/redux_store";
import { bank_upi_api, bank_upi_verify_api } from "@/utils/api_url";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

interface FormData {
  user_bank_name: string;
  user_bank_holder_name: string;
  user_upi_id: string;
}

const UserUpi: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    user_bank_name: "",
    user_bank_holder_name: "",
    user_upi_id: "",
  });
  const [documentid, setDocumentid] = useState('');
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [upiVerified, setUpiVerified] = useState(false);

  const token = useSelector((state: RootState) => state.user.token);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  // Send OTP
  const sendOtp = async () => {
    if (!formData.user_upi_id) {
      toast.error("Enter your UPI ID");
      return;
    }

    setLoading(true);
    try {
     const {data} = await axios.post(
        bank_upi_api,
        {
            upi_link_bank_name: formData.user_bank_name,
            upi_holder_name_aspr_upi: formData.user_bank_holder_name,
            upi_id: formData.user_upi_id,
        },
        {
          headers: { "Authorization": `Bearer ${token}` },
        }
      );
      toast.success("OTP sent successfully!");
      setDocumentid(data.id);
      setOtpSent(true);
      setOtpTimer(120);
      setIsVerifying(true);
    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (otp.length !== 4) {
      toast.error("Enter a valid 4-digit OTP");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        bank_upi_verify_api,
        {documant_id:documentid, otp: otp },
        {
          headers: { "Authorization": `Bearer ${token}` },
        }
      );
      toast.success("UPI ID verified successfully!");
      setUpiVerified(true);
      setIsVerifying(false);
    } catch  {
      toast.error("Invalid OTP, try again!");
    } finally {
      setLoading(false);
    }
  };

  // OTP Timer Countdown
  useEffect(() => {
    if (otpSent && otpTimer > 0) {
      const timer = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [otpSent, otpTimer]);

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiVerified) {
      toast.error("Please verify your UPI ID first");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        bank_upi_api,
        formData,
        { headers: { "Authorization": `Bearer ${token}` } }
      );
      toast.success("UPI details submitted successfully!");
    } catch {
      toast.error("Submission failed, try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h3 className="text-2xl font-semibold mb-4 text-primary">Add Your UPI ID</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="user_bank_name"
          placeholder="Bank Name"
          value={formData.user_bank_name}
          onChange={handleInputChange}
          className="w-full p-2 border rounded mb-3"
        />
        <input
          type="text"
          name="user_bank_holder_name"
          placeholder="Account Holder Name"
          value={formData.user_bank_holder_name}
          onChange={handleInputChange}
          className="w-full p-2 border rounded mb-3"
        />
        <input
          type="text"
          name="user_upi_id"
          placeholder="UPI ID"
          value={formData.user_upi_id}
          onChange={handleInputChange}
          className="w-full p-2 border rounded mb-3"
        />
        <button
          type="button"
          onClick={sendOtp}
          disabled={loading || otpSent || upiVerified}
          className="w-full p-2 bg-primary text-white rounded mb-3"
        >
          {loading ? "Sending OTP..." : "Verify UPI ID"}
        </button>
        {isVerifying && (
          <div>
            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              placeholder="Enter OTP"
              className="w-full p-2 border rounded mb-2"
            />
            {
                otpTimer == 0 ?  <p className="text-sm text-primary cursor-pointer" onClick={sendOtp}>Resend OTP</p> :  <p className="text-sm text-gray-500">Time left: {otpTimer}s</p>
            }
           
            <button
              type="button"
              onClick={verifyOtp}
              className="w-full p-2 bg-primary text-white rounded mt-2"
            >
              {loading ? "Verifying..." : "Submit OTP"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default UserUpi;
