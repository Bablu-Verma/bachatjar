import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import UserModel from "@/model/UserModel";
// import RecordModel from "@/model/CashbackOrderModel";
import ContactUsModel from "@/model/ContactUsModel";
import BlogModel from "@/model/BlogModal";
import CategoryModel from "@/model/CategoryModel";
import StoreModel from "@/model/StoreModel";
import CouponModel from "@/model/CouponModel";
import CampaignModel from "@/model/CampaignModel";
import BlogCategoryModel from "@/model/BlogCategoryModel";
import ClaimFormModel from "@/model/ClaimFormData";
import OrderModel from "@/model/OrderModel";

export async function POST(req: Request) {
  await dbConnect();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const { authenticated, usertype, message } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return new NextResponse(
        JSON.stringify({ success: false, message: message || "User is not authenticated" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const allowedRoles = ["admin", "data_editor", "blog_editor"];
    if (!usertype || !allowedRoles.includes(usertype)) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Access denied: Does not have the required role" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    if (usertype === "admin") {
      const [
        totalUsers, activeUsers, removedUsers,userTodayAdd,
        totalOrders, orderInitialize, orderPending, orderConfirmed, orderFailed, todayInitialize,
        contactUsCount, contactUsNotStart, contactUsOpen, contactUsClosed, contactUsRemoved, ContactTodayAdd,
        totalCategories, activeCategories, inactiveCategories,
        totalBlogCategories, activeBlogCategories, inactiveBlogCategories,
        totalStores, activeStores, inactiveStores,
        totalCoupons, activeCoupons, inactiveCoupons,
        totalCampaigns, activeCampaigns, pausedCampaigns,
        totalBlogs, activeBlogs, inactiveBlogs, removedBlogs,
        totalClaimForms, pendingClaims, approvedClaims, rejectedClaims, claimTodayAdd
      ] = await Promise.all([
        // User Statistics
        UserModel.countDocuments(),
        UserModel.countDocuments({ user_status: "ACTIVE" }),
        UserModel.countDocuments({ user_status: "REMOVED" }),
        UserModel.countDocuments({ user_status: "ACTIVE", createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          }, }),


        // Order Statistics
        OrderModel.countDocuments(),
        OrderModel.countDocuments({ payment_status: "Initialize" }),
        OrderModel.countDocuments({ payment_status: "Pending" }),
        OrderModel.countDocuments({ payment_status: "Confirmed" }),
        OrderModel.countDocuments({ payment_status: "Failed" }),
        OrderModel.countDocuments({
          payment_status: "Initialize",
          createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        }),

        // Contact Us Statistics
        ContactUsModel.countDocuments(),
        ContactUsModel.countDocuments({ action_status: "NOTSTART" }),
        ContactUsModel.countDocuments({ action_status: "OPEN" }),
        ContactUsModel.countDocuments({ action_status: "CLOSED" }),
        ContactUsModel.countDocuments({ action_status: "REMOVED" }),
        ContactUsModel.countDocuments({ action_status: "NOTSTART", createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          }, }),


        // Categories
        CategoryModel.countDocuments(),
        CategoryModel.countDocuments({ status: "ACTIVE" }),
        CategoryModel.countDocuments({ status: "INACTIVE" }),

        // Blog Categories
        BlogCategoryModel.countDocuments(),
        BlogCategoryModel.countDocuments({ status: "ACTIVE" }),
        BlogCategoryModel.countDocuments({ status: "INACTIVE" }),

        // Stores
        StoreModel.countDocuments(),
        StoreModel.countDocuments({ store_status: "ACTIVE" }),
        StoreModel.countDocuments({ store_status: "INACTIVE" }),

        // Coupons
        CouponModel.countDocuments(),
        CouponModel.countDocuments({ status: "ACTIVE" }),
        CouponModel.countDocuments({ status: "INACTIVE" }),

        // Campaigns
        CampaignModel.countDocuments(),
        CampaignModel.countDocuments({ product_status: "ACTIVE" }),
        CampaignModel.countDocuments({ product_status: "PAUSE" }),

        // Blogs
        BlogModel.countDocuments(),
        BlogModel.countDocuments({ status: "ACTIVE" }),
        BlogModel.countDocuments({ status: "INACTIVE" }),
        BlogModel.countDocuments({ status: "REMOVED" }),

        // Claim Forms
        ClaimFormModel.countDocuments(),
        ClaimFormModel.countDocuments({ status: "PENDING" }),
        ClaimFormModel.countDocuments({ status: "APPROVED" }),
        ClaimFormModel.countDocuments({ status: "REJECTED" }),
        ClaimFormModel.countDocuments({ status: "PENDING",createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          } }),
      ]);

      return new NextResponse(
        JSON.stringify({
          success: true,
          message: "Dashboard data retrieved successfully",
          data: {
            users: { total: totalUsers, active: activeUsers, removed: removedUsers,userTodayAdd },
            orders: { total: totalOrders, orderInitialize, orderPending, orderConfirmed, orderFailed, todayInitialize },
            contact_us: { total: contactUsCount, not_started: contactUsNotStart, open: contactUsOpen, closed: contactUsClosed, removed: contactUsRemoved,ContactTodayAdd},
            categories: { total: totalCategories, active: activeCategories, inactive: inactiveCategories },
            blog_categories: { total: totalBlogCategories, active: activeBlogCategories, inactive: inactiveBlogCategories },
            stores: { total: totalStores, active: activeStores, inactive: inactiveStores },
            coupons: { total: totalCoupons, active: activeCoupons, inactive: inactiveCoupons },
            campaigns: { total: totalCampaigns, active: activeCampaigns, paused: pausedCampaigns },
            blogs: { total: totalBlogs, active: activeBlogs, inactive: inactiveBlogs, removed: removedBlogs },
            claim_forms: { total: totalClaimForms, pending: pendingClaims, approved: approvedClaims, rejected: rejectedClaims, claimTodayAdd }
          }
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else if (usertype === "data_editor") {
      const [
        totalCategories, activeCategories, inactiveCategories,
        totalStores, activeStores, inactiveStores,
        totalCoupons, activeCoupons, inactiveCoupons,
        totalCampaigns, activeCampaigns, pausedCampaigns,
        totalClaimForms, pendingClaims, approvedClaims, rejectedClaims
      ] = await Promise.all([
        // Categories
        CategoryModel.countDocuments(),
        CategoryModel.countDocuments({ status: "ACTIVE" }),
        CategoryModel.countDocuments({ status: "INACTIVE" }),

        // Stores
        StoreModel.countDocuments(),
        StoreModel.countDocuments({ store_status: "ACTIVE" }),
        StoreModel.countDocuments({ store_status: "INACTIVE" }),

        // Coupons
        CouponModel.countDocuments(),
        CouponModel.countDocuments({ status: "ACTIVE" }),
        CouponModel.countDocuments({ status: "INACTIVE" }),

        // Campaigns
        CampaignModel.countDocuments(),
        CampaignModel.countDocuments({ product_status: "ACTIVE" }),
        CampaignModel.countDocuments({ product_status: "PAUSE" }),

        // Claim Forms (Fixed Variable Names)
        ClaimFormModel.countDocuments(),
        ClaimFormModel.countDocuments({ status: "PENDING" }),
        ClaimFormModel.countDocuments({ status: "APPROVED" }),
        ClaimFormModel.countDocuments({ status: "REJECTED" }),
      ]);

      return new NextResponse(
        JSON.stringify({
          success: true,
          message: "Dashboard data retrieved successfully",
          data: {
            categories: { total: totalCategories, active: activeCategories, inactive: inactiveCategories },
            stores: { total: totalStores, active: activeStores, inactive: inactiveStores },
            coupons: { total: totalCoupons, active: activeCoupons, inactive: inactiveCoupons },
            campaigns: { total: totalCampaigns, active: activeCampaigns, paused: pausedCampaigns },
            claim_forms: { total: totalClaimForms, pending: pendingClaims, approved: approvedClaims, rejected: rejectedClaims }
          }
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    else if (usertype === "blog_editor") {
      const [
        totalBlogCategories, activeBlogCategories, inactiveBlogCategories,
        totalBlogs, activeBlogs, inactiveBlogs, removedBlogs,
      ] = await Promise.all([

        // Blog Categories
        BlogCategoryModel.countDocuments(),
        BlogCategoryModel.countDocuments({ status: "ACTIVE" }),
        BlogCategoryModel.countDocuments({ status: "INACTIVE" }),

        // Blogs
        BlogModel.countDocuments(),
        BlogModel.countDocuments({ status: "ACTIVE" }),
        BlogModel.countDocuments({ status: "INACTIVE" }),
        BlogModel.countDocuments({ status: "REMOVED" }),

      ]);

      return new NextResponse(
        JSON.stringify({
          success: true,
          message: "Dashboard data retrieved successfully",
          data: {
            blog_categories: { total: totalBlogCategories, active: activeBlogCategories, inactive: inactiveBlogCategories },
            blogs: { total: totalBlogs, active: activeBlogs, inactive: inactiveBlogs, removed: removedBlogs },
          }
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Access denied: Does not have the required role" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }


  } catch (error) {
    console.error("Failed to get dashboard data", error);
    return new NextResponse(
      JSON.stringify({ success: false, message: "Failed to get dashboard data.", error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
