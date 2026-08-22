function mediaOrigin(): string | null {
  const raw = (process.env.WP_MEDIA_DOMAIN || "").trim().split(",")[0]?.trim();
  if (!raw) return null;
  try {
    const u = new URL(raw.includes("://") ? raw : `https://${raw}`);
    return `${u.protocol}//${u.host}`;
  } catch {
    return null;
  }
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  const origin = mediaOrigin();
  return (
    <>
      {origin ? (
        <>
          <link rel="preconnect" href={origin} />
          <link rel="dns-prefetch" href={origin} />
        </>
      ) : null}
      {children}
    </>
  );
}
