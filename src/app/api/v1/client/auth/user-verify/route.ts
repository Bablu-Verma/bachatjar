
import { Welcome_email } from "@/email/welcom_email";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import dbConnect from "@/lib/dbConnect";
import { sendMessage } from "@/lib/sendMessage";
import ConformAmountModel from "@/model/ConformAmountModel";
import UserModel from "@/model/UserModel";

import { NextResponse } from "next/server";

// varify valid user

export async function POST(request: Request) {
  await dbConnect();

  const { authenticated, user, message } =
    await authenticateAndValidateUser(request);

  if (!authenticated) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: message || "User is not authenticated",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }


  try {
    const { otp } = await request.json();

    if (!otp) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "OTP is required",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!(String(otp).length == 4)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Enter 4 digit OTP",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const findUser = await UserModel.findOne({ email: user?.email });

    if (otp != findUser.verify_code) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Enter Valid OTP",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    findUser.email_verified = true;

    const update_user = await findUser.save();

    await Welcome_email(findUser.name, findUser.email)
    await sendMessage({
      userId: findUser._id,         // assuming MongoDB-style _id
      title: "Welcome to BachatJar – Unlock Exclusive Cashback & Deals!",
      body: `Hi ${findUser.name || "there"}, 
  
      Welcome to BachatJar – your new favorite place for saving money! 🎉
      
      From exclusive cashback offers to unbeatable deals, we’re here to make every purchase more rewarding. Start exploring and make the most of your shopping!
      
      Happy Saving,  
      The BachatJar Team 💰`
    });

    const WELCOME_BONUS_AMOUNT = 50;
    const existingBonus = await ConformAmountModel.findOne({ user_id: findUser._id });

    if (!existingBonus) {
      await ConformAmountModel.create({
        amount: WELCOME_BONUS_AMOUNT,
        user_id: findUser._id,
      });

      // Send message to notify user
      await sendMessage({
        userId: findUser._id.toString(),
        title: "🎁 Welcome Bonus Credited – BachatJar",
        body: `Hi ${findUser.name || "there"},

Welcome to BachatJar! You've received a ₹${WELCOME_BONUS_AMOUNT} bonus as a warm welcome from us. 🎉

The bonus has been added to your BachatJar wallet and is ready for use.

Enjoy saving and earning,  
The BachatJar Team 💸`
      });
    }

    const userData = update_user.toObject();


    delete userData.password;
    delete userData.accept_terms_conditions_privacy_policy;
    delete userData.email_verified;
    delete userData.phone_verified;
    delete userData.verify_code;
    delete userData.verify_code_expiry;
    delete userData.user_status;
    delete userData.subscribe_email;
    delete userData.__v



    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "User Verify successfully, Login Now",
        user: userData,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error verify user", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to verify user",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
