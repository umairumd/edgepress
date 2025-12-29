"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/");
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main>
      <div
        className="td-error-area"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 16px",
          background: "#fff",
        }}
      >
        <div className="container" style={{ maxWidth: "820px" }}>
          <div className="row justify-content-center">
            <div className="col-12">
              {/* Use template error typography, but neutralize template margins for true centering */}
              <div
                className="td-error-content text-center"
                style={{
                  marginLeft: 0,
                  marginRight: 0,
                  paddingTop: 0,
                }}
              >
                <h2 style={{ fontSize: "200px" }}>404</h2>
                <div className="sm-title">Page not found</div>
                <p style={{ maxWidth: "520px", margin: "0 auto 34px", color: "rgba(28, 29, 31, 0.7)" }}>
                  Sorry, the page you're looking for doesn't exist.
                </p>
                <Link className="td-btn-2" href="/">Go Home</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
