export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://cms.inomadigital.com" />
      <link rel="dns-prefetch" href="https://cms.inomadigital.com" />
      {children}
    </>
  );
}
