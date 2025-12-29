import HeaderSix from "@/components/layout/HeaderSix";
import FooterSix from "@/components/layout/FooterSix";

export default function InnerCtaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderSix variant="default" />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          {children}
          <FooterSix style />
        </div>
      </div>
    </>
  );
}


