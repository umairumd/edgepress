import type { Metadata } from "next";
import BreadcrumbTwo from "@/components/common/BreadcrumbTwo";
import TeamArea from "@/components/pages/team/TeamArea";
import Brand from "@/components/pages/team/Brand";
import Cta from "@/components/common/Cta";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the people behind Inoma Digital — a strategy-led team focused on delivering measurable growth.",
  alternates: { canonical: "/team" },
};

export default function TeamPage() {
  return (
    <main>
      <BreadcrumbTwo
        sub_title="OUR TEAM MEMBERS"
        title={
          <>
            Our Talented <br /> <span>Team Members</span>
          </>
        }
        desc="We are a group of creative and innovative professionals dedicated to delivering top-notch digital solutions for your business growth."
      />
      <TeamArea />
      <Brand />
      <Cta />
    </main>
  );
}


