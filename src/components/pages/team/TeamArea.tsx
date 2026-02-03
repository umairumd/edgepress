import team_data from "@/data/TeamData";
import Image from "next/image";
import type { TeamMember } from "@/lib/wp";

interface TeamAreaProps {
    /** When provided, team grid uses WordPress data (same source as home carousel). */
    members?: TeamMember[] | null;
}

const TeamArea = ({ members }: TeamAreaProps) => {
    // Use WordPress team members when available; otherwise fall back to static inner_team data
    const filteredStatic = team_data.filter((items) => items.page === "inner_team");

    const sizeFor = (src: string) => {
        if (src.includes("/team/team-5/")) return { w: 307, h: 420 };
        return { w: 438, h: 570 };
    };

    const useWp = members && members.length > 0;

    return (
        <div className="td-team-area td-team-about-wrap">
            <div className="container-fluid">
                <div className="row">
                    {useWp
                        ? members!.map((member) => {
                              const thumb = member.image?.url || "/assets/img/team/team-5/team.jpg";
                              const isRemote = !!member.image?.url;
                              return (
                                  <div key={member.id} className="col-lg-3 col-md-6 col-sm-6">
                                      <div className="td-team-4-wrap p-relative mb-30">
                                          <div className="td-team-4-thumb">
                                              {isRemote ? (
                                                  <Image
                                                      className="w-100"
                                                      src={thumb}
                                                      alt={member.image?.alt || `${member.name} - ${member.role || "Team"}`}
                                                      width={438}
                                                      height={570}
                                                      sizes="(max-width: 768px) 100vw, 25vw"
                                                      style={{ height: "auto", objectFit: "cover" }}
                                                  />
                                              ) : (
                                                  <Image
                                                      className="w-100"
                                                      src={thumb}
                                                      alt={member.name}
                                                      width={438}
                                                      height={570}
                                                      sizes="(max-width: 768px) 100vw, 25vw"
                                                      style={{ height: "auto" }}
                                                  />
                                              )}
                                          </div>
                                          <div className="td-team-4-content text-center">
                                              <span className="td-team-4-subtitle">{member.role || "—"}</span>
                                              <h3 className="td-team-4-title">{member.name}</h3>
                                          </div>
                                      </div>
                                  </div>
                              );
                          })
                        : filteredStatic.map((item) => (
                              <div key={item.id} className="col-lg-3 col-md-6 col-sm-6">
                                  <div className="td-team-4-wrap p-relative mb-30">
                                      <div className="td-team-4-thumb">
                                          <Image
                                              className="w-100"
                                              src={item.thumb}
                                              alt={item.name}
                                              width={sizeFor(item.thumb).w}
                                              height={sizeFor(item.thumb).h}
                                              sizes="(max-width: 768px) 100vw, 25vw"
                                              style={{ height: "auto" }}
                                          />
                                      </div>
                                      <div className="td-team-4-content text-center">
                                          <span className="td-team-4-subtitle">{item.designation}</span>
                                          <h3 className="td-team-4-title">{item.name}</h3>
                                      </div>
                                  </div>
                              </div>
                          ))}
                </div>
            </div>
        </div>
    );
};

export default TeamArea;
