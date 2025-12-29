import Link from "next/link";
import team_data from "@/data/TeamData";
import { useMemo } from "react";

const TeamArea = () => {

    const filteredData = useMemo(() => {
        return team_data.filter((items) => items.page === "inner_team");
    }, []);

    return (
        <div className="td-team-area td-team-about-wrap">
            <div className="container-fluid">
                <div className="row">
                    {filteredData.map((item) => (
                        <div key={item.id} className="col-lg-3 col-md-6 col-sm-6">
                            <div className="td-team-4-wrap p-relative mb-30">
                                <div className="td-team-4-thumb">
                                    <img className="w-100" src={item.thumb} alt="" />
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
