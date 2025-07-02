// lib/gtag.ts
export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

export const pageview = (url: string) => {
  window.gtag('config', GA_ID, {
    page_path: url,
  });
};

export const event = ({
  action,
  category,
  label,
  page_name
}: {
  action: string;
  category: string;
  label: string;
 page_name?: string;
}) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    ...(page_name && { page_name }),
  });
};
