

const main_url = process.env.NEXT_PUBLIC_API_URL || 'https://www/bachatjar.com/api/v1'


export const upload_image_api = process.env.NEXT_PUBLIC_UPLOAD_IMAGE || 'https://bachatjar.com/api/v1/image/upload_image'
export const all_image_api =  main_url + '/image/all_image'
export const image_delete_api =  main_url + '/image/delete_image'

// client api

export const register_api = main_url + '/client/auth/register'
export const google_login_api = main_url + '/client/auth/google-login'
export const user_verify_api = main_url + '/client/auth/user-verify'
export const resend_otp_api = main_url + '/client/auth/resend-otp'
export const login_api = main_url + '/client/auth/login'
export const contact_form_api = main_url + '/client/contactus/add'
export const home_api = main_url + '/client/home'
export const home_deals_api = main_url + '/client/home_deals'
export const edit_profile_api = main_url + '/client/user/edit'
export const category_list_api = main_url + '/client/category/list'
export const category_details_api = main_url + '/client/category/details'
export const blog_details = main_url + '/client/blog/details'
export const get_All_blogs = main_url + '/client/blog/list'
export const product_list_ = main_url + '/client/product/get-all'
export const product_details_ = main_url + '/client/product/get-details'
export const wishlist_list_get_ = main_url + '/client/wishlist/list'
export const store_details_api = main_url + '/client/store/details'
export const coupons_detail_api = main_url + '/client/coupons/detail'
export const blog_category_list_api = main_url + '/client/blog-category/list'
export const blog_category_details_api = main_url + '/client/blog-category/details'
export const bank_upi_api = main_url + '/client/bank/add'
export const bank_upi_verify_api = main_url + '/client/bank/upi-verify'
export const coupons_list_api = main_url + '/client/coupons/get'
export const list_store_api = main_url + '/client/store/list'
export const wishlist_add_ = main_url + '/client/wishlist/add'
export const wishlist_product_remove_ = main_url + '/client/wishlist/remover-product'
export const wishlist__remove_ = main_url + '/client/wishlist/remove-wishlist'
export const search_client_ = main_url + '/client/search'
export const create_order_api = main_url + '/client/order/add'
export const track_coupon_copy_api = main_url + '/client/coupon-code-track/add'
export const order_list_api = main_url + '/client/order/list'
export const edit_user_address_api = main_url + '/client/user-address/edit'
export const user_profile_api = main_url + '/client/user/profile'
export const withdraw_request_data_api = main_url + '/client/withdraw/request-data'
export const withdraw_verify_api = main_url + '/client/withdraw/verify'
export const withdraw_request_api = main_url + '/client/withdraw/request'
export const withdraw_resend_otp_api = main_url + '/client/withdraw/resend-otp'
export const withdraw_list_api = main_url + '/client/withdraw/list'
export const claim_form_add_api = main_url + '/client/claim-form/add'
export const create_share_link_api = main_url + '/client/order/create_share_link'
export const change_password_request_api = main_url + '/client/auth/change_password_request'
export const change_password_save_api = main_url + '/client/auth/change_password_save'
export const newsletter_save_email_api = main_url + '/client/newsletter'
export const message_list_client_api = main_url + '/client/message'
export const message_read_mark_client_api = main_url + '/client/message/read'
export const claim_form_tamp_getone_api = main_url + '/client/claim-form-template/getone'

export const referral_product_list_client_api = main_url + '/client/referral/list'
export const referral_product_details_client_api = main_url + '/client/referral/details'



// dashboard api 

export const add_store_api = main_url + '/dashboard/store/add'
export const list_store_dashboard_api = main_url + '/dashboard/store/list'
export const edit_store_api = main_url + '/dashboard/store/edit'
export const store_details_dashboard_api = main_url + '/dashboard/store/details'
export const category_add_api = main_url + '/dashboard/category/add'
export const category_list_dashboard_api = main_url + '/dashboard/category/list'
export const category_details_dashboard_api = main_url + '/dashboard/category/details'
export const category_edit_api = main_url + '/dashboard/category/edit'
export const blog_category_edit_api = main_url + '/dashboard/blog-category/edit'
export const add_blog_category_api = main_url + '/dashboard/blog-category/add'
export const blog_category_dashboard_list_api = main_url + '/dashboard/blog-category/list'
export const blog_category_dashboard_details_api = main_url + '/dashboard/blog-category/details'
export const add__blog_ = main_url + '/dashboard/blog/add'
export const blog_edit = main_url + '/dashboard/blog/edit'
export const blog_delete = main_url + 'dashboard/blog/delete'
export const blog_dashboard_details = main_url + '/dashboard/blog/details'
export const get_All_dashboard_blogs = main_url + '/dashboard/blog/list'
export const add_coupons_api = main_url + '/dashboard/coupons/add'
export const coupons_list_dashboard_api = main_url + '/dashboard/coupons/get'
export const edit_coupons_api = main_url + '/dashboard/coupons/edit'
export const coupons_detail_dashoard_api = main_url + '/dashboard/coupons/detail'
export const add_product = main_url + '/dashboard/product/add'
export const product_edit_ = main_url + '/dashboard/product/edit'
export const product_dashboard_list_ = main_url + '/dashboard/product/get-all'
export const product_dashboard_details_ = main_url + '/dashboard/product/get-details'
export const pinback_report_add_api = main_url + '/dashboard/report/pinback/add'
export const offline_report_add_api = main_url + '/dashboard/report/offline/add'
export const manual_report_add_api = main_url + '/dashboard/report/manual/add'
export const report_list_api = main_url + '/dashboard/report/list'
export const all_users = main_url + '/dashboard/user/list'
export const users_details_admin = main_url + '/dashboard/user/user-details'
export const users_edit_details_admin = main_url + '/dashboard/user/edit_user_details'
export const users_detail_edit_by_admin = main_url + '/dashboard/user/edit'
export const contact_us_list_api = main_url + '/dashboard/contactus/list'
export const contact_us_update_api = main_url + '/dashboard/contactus/edit'
export const bank_upi_admin_list_api = main_url + '/dashboard/bank/upi-list'
export const order_list_admin_api = main_url + '/dashboard/order/list'
export const order_edit_admin_api = main_url + '/dashboard/order/edit'
export const order_detals_admin_api = main_url + '/dashboard/order/detail'
export const withdrwal_list_admin_api = main_url + '/dashboard/withdrawal/list'
export const withdrwal_editstatus_admin_api = main_url + '/dashboard/withdrawal/edit'
export const withdrwal_request_details_admin_api = main_url + '/dashboard/withdrawal/details'
export const claim_form_list_api = main_url + '/dashboard/claim-form/list'
export const claim_form_edit_api = main_url + '/dashboard/claim-form/edit'
export const newsletter_get_api = main_url + '/dashboard/newsletter'
export const newsletter_delete_api = main_url + '/dashboard/newsletter/delete'

export const send_message_api = main_url + '/dashboard/message/send-message'
export const message_list_api = main_url + '/dashboard/message/list'
export const message_delete_api = main_url + '/dashboard/message/delete'

export const claim_form_tamp_add_api = main_url + '/dashboard/claim-form-template/add'
export const claim_form_tamp_list_api = main_url + '/dashboard/claim-form-template/list'
export const claim_form_tamp_delete_api = main_url + '/dashboard/claim-form-template/delete'



export const referral_product_add_api = main_url + '/dashboard/referral/add'
export const referral_product_list_api = main_url + '/dashboard/referral/list'
export const referral_product_edit_api = main_url + '/dashboard/referral/edit'
export const referral_product_details_api = main_url + '/dashboard/referral/details'





















