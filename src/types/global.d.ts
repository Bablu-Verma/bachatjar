export {};

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;

    Tawk_API: {
      showWidget?: () => void;
      hideWidget?: () => void;
      setAttributes?: (
        attributes: {
          name?: string;
          email?: string;
        },
        callback?: (error: unknown) => void
      ) => void;
    };
  }
}

// ✅ Extend Puppeteer interfaces
declare module 'puppeteer' {
  interface Frame {
    $x(expression: string): Promise<import('puppeteer').ElementHandle[]>;
  }

  interface ElementHandle {
    $x(expression: string): Promise<import('puppeteer').ElementHandle[]>;
  }
}
