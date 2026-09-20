import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CaretRightIcon } from '@phosphor-icons/react';
import RankingService from '@/api/services/rankingService.js';
import UserService from '@/api/services/userService.js';
import ImagePlaceholder from '../../components/ImagePlaceholder';
import './ContentsHome.css';

// MEMO: MVP 기간에는 지역이 부산광역시로 고정됩니다.
const CITY = '부산광역시';
const RANKING_TOP_N = 3;
// MEMO: 즐겨찾기 섹션은 4개(그리드 한 줄)를 초과할 때만 "더보기"를 보여주고, 미리보기는 4개까지만 표시합니다.
const FAVORITE_PREVIEW_SIZE = 4;

function ContentsHome() {
  const [rankings, setRankings] = useState([]);
  const [favoriteArtists, setFavoriteArtists] = useState([]);
  const [favoriteMedia, setFavoriteMedia] = useState([]);
  const [favoritePlaces, setFavoritePlaces] = useState([]);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const data = await RankingService.getLocationRanking({
          city: CITY,
          topN: RANKING_TOP_N,
        });

        // MEMO: 동점 처리로 topN보다 더 많이 내려올 수 있어서 프론트에서 한 번 더 자릅니다.
        setRankings((data.rankings ?? []).slice(0, RANKING_TOP_N));
      } catch (e) {
        console.error(e);
      }
    };

    const fetchFans = async () => {
      try {
        const data = await UserService.getMyFans();
        console.log('[ContentsHome] 팬 목록 응답:', data);
        setFavoriteArtists(data.artist ?? []);
        setFavoriteMedia(data.content ?? []);
      } catch (e) {
        console.error(e);
      }
    };

    const fetchLikedLocations = async () => {
      try {
        const data = await UserService.getMyLikedLocations();
        console.log('[ContentsHome] 좋아요한 여행지 응답:', data);
        setFavoritePlaces(data ?? []);
      } catch (e) {
        console.error(e);
      }
    };

    fetchRanking();
    fetchFans();
    fetchLikedLocations();
  }, []);

  return (
    <main className="contents-home">
      <div className="container">
        <section className="ranking">
          <div className="header">
            <div className="title">
              <h2>실시간 순위</h2>
              <span className="region accent-text">{CITY}</span>
            </div>
            <Link className="go-to-ranking accent-text" to="/ranking">
              더보기
              <span className="icon">
                <CaretRightIcon />
              </span>
            </Link>
          </div>
          <ul className="ranking-list">
            {rankings.map((ranking) => (
              <li className="item relative" key={ranking.locationId}>
                <Link to={`/place?id=${ranking.locationId}`}>
                  <span className={`rank ${ranking.rank === 1 ? 'top-1' : ''}`}>
                    {ranking.rank}
                  </span>
                  <div className="image">
                    {ranking.imageUrl ? (
                      <img src={ranking.imageUrl} alt={ranking.locationName} />
                    ) : (
                      <ImagePlaceholder
                        name={ranking.locationName}
                        type="place"
                      />
                    )}
                  </div>
                  <p className="name ellipsis-1">{ranking.locationName}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="favorite-section favorite-artists">
          <div className="header">
            <h3>내가 좋아하는 아티스트</h3>
            {favoriteArtists.length > FAVORITE_PREVIEW_SIZE && (
              <Link className="more-artists accent-text" to="/list?type=artist">
                더보기
                <span className="icon">
                  <CaretRightIcon />
                </span>
              </Link>
            )}
          </div>
          {favoriteArtists.length === 0 ? (
            <p className="empty">좋아하는 아티스트를 추가해볼까요?</p>
          ) : (
            <ul className="list">
              {favoriteArtists.slice(0, FAVORITE_PREVIEW_SIZE).map((artist) => (
                <li className="item" key={artist.id}>
                  <Link to={`/content/detail?type=artist&id=${artist.id}`}>
                    <div className="image">
                      {artist.pictureUrl ? (
                        <img src={artist.pictureUrl} alt={artist.name} />
                      ) : (
                        <ImagePlaceholder type="artist" />
                      )}
                    </div>
                    <div className="title ellipsis-2">{artist.name}</div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="favorite-section favorite-media">
          <div className="header">
            <h3>내가 좋아하는 미디어</h3>
            {favoriteMedia.length > FAVORITE_PREVIEW_SIZE && (
              <Link className="more-media accent-text" to="/list?type=media">
                더보기
                <span className="icon">
                  <CaretRightIcon />
                </span>
              </Link>
            )}
          </div>
          {favoriteMedia.length === 0 ? (
            <p className="empty">좋아하는 미디어를 추가해볼까요?</p>
          ) : (
            <ul className="list">
              {favoriteMedia.slice(0, FAVORITE_PREVIEW_SIZE).map((content) => (
                <li className="item" key={content.id}>
                  <Link to={`/content/detail?id=${content.id}`}>
                    <div className="image">
                      {content.pictureUrl ? (
                        <img src={content.pictureUrl} alt={content.name} />
                      ) : (
                        <ImagePlaceholder type="contents" />
                      )}
                    </div>
                    <div className="title ellipsis-2">{content.name}</div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="favorite-section favorite-places">
          <div className="header">
            <h3>내가 좋아하는 여행지</h3>
            {favoritePlaces.length > FAVORITE_PREVIEW_SIZE && (
              <Link className="more-places accent-text" to="/list?type=place">
                더보기
                <span className="icon">
                  <CaretRightIcon />
                </span>
              </Link>
            )}
          </div>
          {favoritePlaces.length === 0 ? (
            <p className="empty">가고 싶은 여행지를 저장해보세요.</p>
          ) : (
            <ul className="list">
              {favoritePlaces.slice(0, FAVORITE_PREVIEW_SIZE).map((place) => (
                <li className="item" key={place.id}>
                  <Link to={`/place?id=${place.id}`}>
                    <div className="image">
                      {place.mainImageUrl ? (
                        <img src={place.mainImageUrl} alt={place.name} />
                      ) : (
                        <ImagePlaceholder type="place" />
                      )}
                    </div>
                    <div className="title ellipsis-2">{place.name}</div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

export default ContentsHome;
