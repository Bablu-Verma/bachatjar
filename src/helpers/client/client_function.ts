/* eslint-disable @typescript-eslint/no-explicit-any */

export function setClientCookie(cookie_name:string, cookie_value:string, duration_in_minutes:number) {
    const now = new Date();
    if (duration_in_minutes === 0) {
        now.setTime(now.getTime() - 1);
    } else {
        now.setTime(now.getTime() + (duration_in_minutes * 60 * 1000)); 
    }
  
    const expires = `expires=${now.toUTCString()}`;
    // document.cookie = `${cookie_name}=${encodeURIComponent(JSON.stringify(cookie_value))}; ${expires}; path=/; secure; SameSite=Strict;`;
    document.cookie = `${cookie_name}=${cookie_value}; ${expires}; path=/; secure; SameSite=Strict;`;
  }
  
  
  export function getClientCookie(cookie_name: string):any{
    const cookies = document.cookie || "";
  
    const value = `; ${cookies}`;
    const parts = value.split(`; ${cookie_name}=`);
  
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift(); 
      if (cookieValue) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  }
  
  
  export function parse_json_string(cookie_name:string) {
    const cookie_value = getClientCookie(cookie_name);
  
    if (cookie_value) {
        try {
            return JSON.parse(decodeURIComponent(cookie_value)); 
        } catch (error) {
            console.error("Failed to parse userInfo from cookie:", error);
            return null;
        }
    }
    return null; 
  }
  
  export const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };



  export const getTimeAgo = (createdAt: string | Date) => {
    const now = new Date();
    const createdDate = createdAt instanceof Date ? createdAt : new Date(createdAt);
    const diffInMs = now.getTime() - createdDate.getTime();
  
    const seconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  };


  export function formatDate(createdAt:Date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    }).format(new Date(createdAt));
}