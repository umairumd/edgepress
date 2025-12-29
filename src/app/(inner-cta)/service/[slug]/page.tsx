import ServiceDetailsArea from "@/components/pages/services/service-details/ServiceDetailsArea";
import ServiceProcess from "@/components/pages/services/service-details/ServiceProcess";
import Faq from "@/components/pages/services/service-details/Faq";
import ServiceReplace from "@/components/pages/services/service-details/ServiceReplace";
import Cta from "@/components/common/Cta";

export default function ServiceDetailsPage({ params }: { params: { slug: string } }) {
  return (
    <main>
      <ServiceDetailsArea />
      <ServiceProcess />
      <Faq style={false} />
      <ServiceReplace />
      <Cta />
    </main>
  );
}


