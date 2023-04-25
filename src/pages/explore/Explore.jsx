import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Select from "react-select";

import "./style.scss";

import useFetch from "../../hooks/useFetch";
import { fetchDataFromApi } from "../../utils/api";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import MovieCard from "../../components/movieCard/MovieCard";
import Spinner from "../../components/spinner/Spinner";
import noResults from "../../assets/no-results.png";

let filters = {};

const sortbyData = [
    { value: "popularity.desc", label: "Popularity Descending" },
    { value: "popularity.asc", label: "Popularity Ascending" },
    { value: "vote_average.desc", label: "Rating Descending" },
    { value: "vote_average.asc", label: "Rating Ascending" },
    {
        value: "primary_release_date.desc",
        label: "Release Date Descending",
    },
    { value: "primary_release_date.asc", label: "Release Date Ascending" },
    { value: "original_title.asc", label: "Title (A-Z)" },
]

const pageTitle = {
    tv: "Explore TV Shows",
    movie: "Explore Movies",
    trending: "Explore Trending",
    popular: "Explore Popular",
    top_rated: "Explore Top Rating",

}

const TrendingType = [
    { value: "all", label: "All" },
    { value: "movie", label: "Movie" },
    { value: "tv", label: "Tv Show" },
]

const PopularType = [
    { value: "movie", label: "Movie" },
    { value: "tv", label: "Tv Show" },
]


const Explore = () => {
    const [data, setData] = useState(null);
    const [pageNum, setPageNum] = useState(1);
    const [loading, setLoading] = useState(false);
    const [genre, setGenre] = useState(null);
    const [sortby, setSortby] = useState(null);
    const { mediaType } = useParams();
    const [trendingType, setTrendingType] = useState('all');
    const [popularType, setPopularType] = useState('movie');

    const { data: genresData } = useFetch(`/genre/${mediaType}/list`);

    const fetchInitialData = (Type) => {
        let url = "";
        if (mediaType === "movie" || mediaType === "tv") {
            url = `/discover/${mediaType}`;
        } else if (mediaType === "trending") {
            url = `/trending/${Type ? Type : trendingType}/day`
        } else if(mediaType === "popular"){
            url = `/${Type ? Type : popularType}/popular`
        }else if(mediaType === "top_rated"){
            url = `/${Type ? Type : popularType}/top_rated`
        }

        setLoading(true);
        fetchDataFromApi(url, filters).then((res) => {
            setData(res);
            setPageNum((prev) => prev + 1);
            setLoading(false);
        });
    };

    const fetchNextPageData = () => {
        let url = "";
        if (mediaType === "movie" || mediaType === "tv") {
            url = `/discover/${mediaType}?page=${pageNum}`;
        } else if (mediaType === "trending") {
            url = `/trending/${trendingType}/day?page=${pageNum}`
        }else if (mediaType === "popular") {
            url = `/${popularType}/popular?page=${pageNum}`
        }else if(mediaType === "top_rated"){
            url = `/${popularType}/top_rated?page=${pageNum}`
        }

        fetchDataFromApi(url, filters).then(
            (res) => {
                if (data?.results) {
                    setData({
                        ...data,
                        results: [...data?.results, ...res.results],
                    });
                } else {
                    setData(res);
                }
                setPageNum((prev) => prev + 1);
            }
        );
    };

    useEffect(() => {
        filters = {};
        setData(null);
        setPageNum(1);
        setSortby(null);
        setGenre(null);
        fetchInitialData();
    }, [mediaType]);

    const onChange = (selectedItems, action) => {
        if (action.name === "sortby") {
            setSortby(selectedItems);
            if (action.action !== "clear") {
                filters.sort_by = selectedItems.value;
            } else {
                delete filters.sort_by;
            }
        }

        if (action.name === "genres") {
            setGenre(selectedItems);
            if (action.action !== "clear") {
                let genreId = selectedItems.map((g) => g.id);
                genreId = JSON.stringify(genreId).slice(1, -1);
                filters.with_genres = genreId;
            } else {
                delete filters.with_genres;
            }
        }

        setPageNum(1);
        fetchInitialData();
    }

    const onChangeType = (selectedItems) => {
        setTrendingType(selectedItems.value)
        setSortby(selectedItems)
        fetchInitialData(selectedItems.value)
        setPopularType(selectedItems.value)
    }

    const handlePageTitle = (title) => {
        return pageTitle[title]
    }

    return (
        <div className="explorePage">
            <ContentWrapper>
                <div className="pageHeader">
                    <div className="pageTitle">
                        {handlePageTitle(mediaType)}
                    </div>
                    <div className="filters">
                        {mediaType === "movie" || mediaType === "tv" ?
                            (
                                <>

                                    <Select
                                        isMulti
                                        name="genres"
                                        value={genre}
                                        closeMenuOnSelect={false}
                                        options={genresData?.genres}
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option.id}
                                        onChange={onChange}
                                        placeholder="Select genres"
                                        className="react-select-container genresDD"
                                        classNamePrefix="react-select"
                                    />
                                    <Select
                                        name="sortby"
                                        value={sortby}
                                        options={sortbyData}
                                        onChange={onChange}
                                        isClearable={true}
                                        placeholder="Sort by"
                                        className="react-select-container sortbyDD"
                                        classNamePrefix="react-select"
                                    />

                                </>)
                            :

                            (
                                <Select
                                    name="Type"
                                    value={sortby}
                                    options={ mediaType === "movie" ? TrendingType : PopularType}
                                    onChange={onChangeType}
                                    isClearable={true}
                                    placeholder={mediaType === "movie"? "Select genres": "Movie"}
                                    className="react-select-container sortbyDD"
                                    classNamePrefix="react-select"
                                />
                            )

                        }

                    </div>
                </div>
                {loading && <Spinner initial={true} />}
                {!loading && (
                    <>
                        {data?.results?.length > 0 ? (
                            <InfiniteScroll
                                className="content"
                                dataLength={data?.results?.length || []}
                                next={fetchNextPageData}
                                hasMore={pageNum <= data?.total_pages}
                                loader={<Spinner />}
                            >
                                {data?.results?.map((item, index) => {
                                    if (item.media_type === "person") return;
                                    return (
                                        <MovieCard key={index} data={item} mediaType={mediaType} />
                                    );
                                })}
                            </InfiniteScroll>
                        ) : (
                            <span className="resultNotFound">
                                <div className="pageTitle">Sorry, Results not found!</div>
                                <img src={noResults} />
                            </span>
                        )}
                    </>
                )}
            </ContentWrapper>
        </div>
    );
};

export default Explore;
