export interface IUser {
    id: string;
    name: string;
    phone: string;
    email: string;
    dob: string;
    gender: string;
    token: string;
    profile: string | null;
}

export interface IUserAddress {
  house_no: string;
  landmark: string;
  street?: string;
  area?: string;
  city_village: string;
  state: string;
  pincode: string;
  country: string;
}

export interface ICategory {
  name: string; 
  description: string; 
  slug: string; 
  status: boolean;
  imges: string;
  deleted_category:boolean;
}
export interface IProduct {
  brand: string;
  title: string; 
  slug: string; 
  status: boolean;
  banner: boolean;
  price: number;
  active: boolean;
  img: string;
  category:boolean;
}
export interface loginpayload {
  email?: string;
  role?:string;
  user_id?:string
}