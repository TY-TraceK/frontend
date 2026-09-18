import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SearchService from "@/api/services/searchService.js";
import {
  CONTENT_CATEGORY_OPTIONS,
  LOCATION_CATEGORY_OPTIONS,
} from "@/constants/rankingConstants.js";
import "./Search.css";

const getLocationCategoryLabel = (category) =>
  LOCATION_CATEGORY_OPTIONS.find((option) => option.value === category)?.label ??
  category;

const getContentCategoryLabel = (category) =>
  CONTENT_CATEGORY_OPTIONS.find((option) => option.value === category)?.label ??
  category;

function Search() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword")?.trim() ?? "";

  // MEMO: null = 아직 검색 응답을 못 받은 상태. 검색하면 {artists, contents, locations}로 채워집니다.
  const [results, setResults] = useState(null);
  // MEMO: 마지막으로 실제 응답을 받은 키워드. keyword와 다르면 아직 이 검색어의 결과가 아닙니다.
  const [resultsKeyword, setResultsKeyword] = useState(null);

  // 검색 키워드 2글자 이상 match 방어
  useEffect(() => {
    if (keyword.length < 2) {
      return;
    }

    const fetchResults = async () => {
      try {
        const data = await SearchService.search(keyword);
        setResults(data);
        setResultsKeyword(keyword);
      } catch (e) {
        console.error(e);
        window.alert("검색에 실패했습니다.");
      }
    };

    fetchResults();
  }, [keyword]);

  const artists = results?.artists ?? [];
  const contents = results?.contents ?? [];
  const locations = results?.locations ?? [];
  const hasSearched = keyword.length >= 2 && resultsKeyword === keyword;
  const hasNoResult =
    hasSearched &&
    artists.length === 0 &&
    contents.length === 0 &&
    locations.length === 0;

  return (
    <main className="search">
      <div className="container">
        {hasNoResult && (
          <section className="search-empty">
            <h2>검색 결과가 없어요.</h2>
            <div className="notice">
              <p>입력한 검색어와 일치하는</p>
              <p>아티스트, 미디어, 장소가 없습니다.</p>
            </div>
          </section>
        )}

        {hasSearched && !hasNoResult && (
          <>
            {/* MEMO: 아티스트, 미디어, 플레이스 중 검색 결과가 없는 경우, 해당 섹션 hidden 처리 */}
            <section className={`artist-area ${artists.length === 0 ? "hidden" : ""}`}>
              <h2>아티스트</h2>
              <ul className="list">
                {artists.map((artist) => (
                  <li className="item" key={artist.id}>
                    <Link to={`/content/detail?type=artist&id=${artist.id}`}>
                      <div className="image">
                        {artist.pictureUrl && (
                          <img src={artist.pictureUrl} alt={artist.name} />
                        )}
                      </div>
                      <p className="name">{artist.name}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className={`media-area ${contents.length === 0 ? "hidden" : ""}`}>
              <h2>미디어</h2>
              <ul className="list">
                {contents.map((content) => (
                  <li className="item" key={content.id}>
                    <Link to={`/content/detail?id=${content.id}`}>
                      <div className="image">
                        {content.pictureUrl && (
                          <img src={content.pictureUrl} alt={content.title} />
                        )}
                      </div>
                      <div className="info">
                        <span className="tag">
                          {getContentCategoryLabel(content.category)}
                        </span>
                        <p className="title">{content.title}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className={`place-area ${locations.length === 0 ? "hidden" : ""}`}>
              <h2>장소</h2>
              <ul className="list">
                {locations.map((location) => (
                  <li className="item" key={location.id}>
                    <Link to={`/place?id=${location.id}`}>
                      <div className="image">
                        {location.mainImageUrl && (
                          <img src={location.mainImageUrl} alt={location.name} />
                        )}
                      </div>
                      <div className="info">
                        <span className="tag">
                          {getLocationCategoryLabel(location.category)}
                        </span>
                        <p className="title">{location.name}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

export default Search;
