'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useSelector } from 'react-redux';
import { IUser } from '@/common_type';
import { RootState } from '@/redux-store/redux_store';



export default function TawkToWidget() {
  const pathname = usePathname();
  const token = useSelector((state: RootState) => state.user.token);
  const user = useSelector((state: RootState) => state.user.user) as IUser | null;

  const isLogin = !!token;

  useEffect(() => {

    const interval = setInterval(() => {
      if (
        typeof window !== 'undefined' &&
        window.Tawk_API &&
        typeof window.Tawk_API.showWidget === 'function' &&
        typeof window.Tawk_API.hideWidget === 'function'
      ) {
        if (pathname === '/' || pathname === '/contact-us') {
          window.Tawk_API.showWidget!();
        } else {
          window.Tawk_API.hideWidget!();
        }

        if (isLogin && user?.name && user?.email) {
          if (typeof window.Tawk_API.setAttributes === 'function') {
            window.Tawk_API.setAttributes(
              {
                name: user.name,
                email: user.email,
              },
              function (error) {
                if (error) {
                  console.error('Tawk.to setAttributes error:', error);
                }
              }
            );
          }
        }
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [pathname]);

  return (
    <Script
      id="tawkto-chat"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
          (function() {
            var s1 = document.createElement("script"),
              s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = 'https://embed.tawk.to/68731ad38a0a5f1914737fb9/1j00q1ilh';
            s1.charset = 'UTF-8';
            s1.setAttribute('crossorigin', '*');
            s0.parentNode.insertBefore(s1, s0);
          })();
        `,
      }}
    />
  );
}
