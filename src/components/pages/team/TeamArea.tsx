import Link from "next/link";
import team_data from "@/data/TeamData";
import Image from "next/image";

const TeamArea = () => {

    const filteredData = team_data.filter((items) => items.page === "inner_team");

    const sizeFor = (src: string) => {
        // Match actual asset dimensions to avoid CLS.
        if (src.includes("/team/team-5/")) return { w: 307, h: 420 };
        return { w: 438, h: 570 };
    };

    return (
        <div className="td-team-area td-team-about-wrap">
            <div className="container-fluid">
                <div className="row">
                    {filteredData.map((item) => (
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
                                    <h3 className="td-team-4-title"><Link href="/team-details">{item.name}</Link></h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TeamArea;
