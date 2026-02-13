import type { Metadata } from "next";
import BreadcrumbTwo from "@/components/common/BreadcrumbTwo";
import TeamArea from "@/components/pages/team/TeamArea";
import Brand from "@/components/pages/team/Brand";
import Cta from "@/components/common/Cta";
import { getTeamMembers } from "@/lib/wp";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Meet the team behind Inoma Digital. Our creative and technical professionals deliver strategic digital solutions that drive sustainable business growth.",
  alternates: { canonical: "/team" },
};

export const revalidate = 3600;

export default async function TeamPage() {
  const members = await getTeamMembers(50);
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
      <TeamArea members={members} />
      <Brand />
      <Cta />
    </main>
  );
}


