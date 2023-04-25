import React, { useState } from "react";

import Carousel from "../../../components/carousel/Carousel";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import SwitchTabs from "../../../components/switchTabs/SwitchTabs";

import useFetch from "../../../hooks/useFetch";
import { useNavigate } from "react-router-dom";

const Popular = () => {
    const [endpoint, setEndpoint] = useState("movie");
    
    const { data, loading } = useFetch(`/${endpoint}/popular`);
    const navigate = useNavigate()
    

    const onTabChange = (tab) => {
        setEndpoint(tab === "Movies" ? "movie" : "tv");
    };

    const navigationHandler = (type) => {
        navigate(`/explore/${type}`);
    }

    return (
        <div className="carouselSection">
            <ContentWrapper>
                <span className="carouselTitle" onClick={()=>navigationHandler("popular")}>Popular</span>
                <SwitchTabs
                    data={["Movies", "TV Shows"]}
                    onTabChange={onTabChange}
                />
            </ContentWrapper>
            <Carousel
                data={data?.results}
                loading={loading}
                endpoint={endpoint}
            />
        </div>
    );
};

export default Popular;
