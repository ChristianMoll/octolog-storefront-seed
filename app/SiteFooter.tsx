'use client';

import { Footer } from '@scaffold';

export default function SiteFooter() {
  return (
    <Footer
      variant="default"
      links={[
        { name: 'Help & contact', href: '/' },
        { name: 'Terms & conditions', href: '/' },
        { name: 'FAQ', href: '/' },
      ]}
      copyrightStatement="© Powered by commercetools"
    />
  );
}
