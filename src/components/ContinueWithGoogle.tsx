"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { signInWithPopup } from "firebase/auth";
import { firebase_auth, google_provider } from "../lib/firebase";

import Image from "next/image";
import google_image from '../../public/google_logo.webp'
import axios from "axios";
import { google_login_api } from "@/utils/api_url";
import { login } from "@/redux-store/slice/userSlice";
import { setSummary } from "@/redux-store/slice/cashbackSummary";








const WithGoogle = () => {

 const dispatch = useDispatch()


 const loginWithGoogle = async () => {

    try {
        const result = await signInWithPopup(firebase_auth, google_provider);
        const user = result.user;
        const idToken = await user.getIdToken();

        // console.log("User idToken:", idToken);


        const { data } = await axios.post(
            google_login_api,
            {
                google_token: idToken
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        // console.log("login responce data",data)
    
        dispatch(login({ user: data.user, token: data.token }));
        dispatch(setSummary({ summary: data.summary }));

        setTimeout(() => {
            window.location.href = "/";
        }, 1000);

    } catch (error) {
        console.error("Login error", error);
    }
};

    return (
        <button onClick={loginWithGoogle} className="flex justify-center gap-2 items-center m-auto py-[4px] rounded-md shadow-sm px-4 border-[1px] border-gray-300">
            <Image width={22} src={google_image} alt="google logo" />
            <span className="text-secondary text-base">Continue with Google</span>
        </button>
    );
};

export default WithGoogle;
