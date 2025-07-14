export {};

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag: (...args: any[]) => void;
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Tawk_API: {
      showWidget?: () => void;
      hideWidget?: () => void;
      setAttributes?: (
      attributes: {
        name?: string;
        email?: string;
      },
      callback?: (error) => void
    ) => void;
    };
  }
}