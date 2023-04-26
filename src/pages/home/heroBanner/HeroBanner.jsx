import React, { useState, useEffect,memo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RiArrowLeftCircleLine, RiArrowRightCircleLine, RiStarHalfLine } from "react-icons/ri";
import "./style.scss";
import dayjs from "dayjs";

import useFetch from "../../../hooks/useFetch";
import VideoPopup from "../../../components/videoPopup/VideoPopup";
import Img from "../../../components/lazyLoadImage/Img";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import { fetchDataFromApi } from "../../../utils/api";

let filters = {};

const HeroBanner = () => {
    const [background, setBackground] = useState("");
    const [show, setShow] = useState(false);
    const [videoId, setVideoId] = useState(null);
    const [page, setPage] = useState(0)
    const [load, setLoad] = useState(true)

    const navigate = useNavigate();
    const { url } = useSelector((state) => state.home);
    const { data, loading } = useFetch("/movie/upcoming");

    console.log("herobanner")

    useEffect(() => {
        const random = Math.floor(Math.random() * 20)
        const bg =
            url.backdrop +
            data?.results?.[random]?.backdrop_path;
        setPage(random)
        setBackground(bg);
        setLoad(loading)

    }, [data]);

    useEffect(() => {
        if (background) {
            setLoad(true)
            setTimeout(() => {
                setLoad(false)
            }, 2000)
        }
    }, [background])


    const handlePage = (state) => {
        if (state === "pre") {
            let currPage = page - 1
            currPage < 0 ? currPage = 19 : currPage
            let bg = url.backdrop + data?.results?.[currPage]?.backdrop_path
            setPage(currPage)
            setBackground(bg)
        } else if (state === "next") {
            let currPage = page + 1
            currPage >= 20 ? currPage = 0 : currPage
            let bg = url.backdrop + data?.results?.[currPage]?.backdrop_path
            setPage(currPage)
            setBackground(bg)
        }
    }

    const handleWatchTrailer=()=>{
        fetchDataFromApi(`/movie/${data?.results?.[page].id}/videos`, filters).then((res) => {
            if(res){
                setShow(true)
                setVideoId(res?.results[0].key)
            }
        })
    }

    return (
        <div className="heroBanner">
            {!load && (
                <div className="backdrop-img">
                    <Img src={background} className="img" />
                </div>
            )}

            <div className="opacity-layer"></div>
            <ContentWrapper>
                <div className="heroBannerHeader">
                    <span className="title">Welcome.</span>
                    <span className="subTitle">
                        Millions of movies, TV shows and people to discover. Explore now.
                    </span>
                </div>
                <div className="heroBannerContent">
                    <div className="contentImg">
                        <div className="preBtn" onClick={() => handlePage("pre")}>
                            <RiArrowLeftCircleLine style={{ color: "white", fontSize: "60px" }} />
                        </div>

                        {load ? (
                            <div className="loadImg">
                                <div className="loaderImg"></div>
                            </div>

                        )
                            :
                            <Img src={background ? background : "https://uploads-us-west-2.insided.com/looker-en/attachment/d0a25f59-c9b7-40bd-b98e-de785bbd04e7.png"} className="contentImgSRC" />
                        }

                        <div className="nextBtn" onClick={() => handlePage("next")}>
                            <RiArrowRightCircleLine style={{ color: "white", fontSize: "60px" }} />
                        </div>
                    </div>
                    {!load ? (
                        <div className="info-movie">
                            <div className="info-movie-heaader">
                                <div className="info-movie-title">
                                    <div className="info-movie-name">
                                        {data?.results?.[page].original_title}
                                        <div className="info-movie-voted">
                                            {data?.results?.[page].vote_average}
                                            <RiStarHalfLine style={{ color: "#fffb01", fontSize: "20px", margin: "0 0 0 4px" }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="info-movie-overview">
                                    {data?.results?.[page].overview}
                                </div>
                            </div>
                            <div className="info-movie-content">
                                <div className="release-date">
                                    <div>Movie premiere: </div>
                                    <div>{dayjs(data?.results?.[page].release_date).format(
                                        "MMM D, YYYY"
                                    )}
                                    </div>
                                </div>
                                <button className="buttonTrailer" onClick={handleWatchTrailer}> Watch Trailer
                                </button>
                            </div>
                        </div>
                    ) : <></>}
                    <div className="BtnMobile">
                        <div className="preBtnMobile" onClick={() => handlePage("pre")}>
                            <RiArrowLeftCircleLine style={{ color: "rgb(255, 255, 255, 0.6)", fontSize: "60px" }} />
                        </div>
                        <div className="nextBtnMobile" onClick={() => handlePage("next")}>
                            <RiArrowRightCircleLine style={{ color: "rgb(255, 255, 255,0.6)", fontSize: "60px" }} />
                        </div>

                    </div>

                </div>
                <VideoPopup
                    show={show}
                    setShow={setShow}
                    videoId={videoId}
                    setVideoId={setVideoId}
                />
            </ContentWrapper>
        </div>
    );
};

export default HeroBanner;  
