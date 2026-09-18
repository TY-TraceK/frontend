import { useState } from 'react';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { notification } from 'antd';

import VerifyService from '@/api/services/verifyService';
import { CONTENT_CATEGORY_OPTIONS } from '@/constants/rankingConstants.js';

const getContentCategoryLabel = (category) =>
  CONTENT_CATEGORY_OPTIONS.find((option) => option.value === category)?.label ??
  category;

function ArtistSearch({
  selectedSearchArtist,
  onSelectSearchArtist,
  onResetSelectedSearchArtist,

  searchedArtistContents,
  selectedContent,
  onSelectContent,
}) {
  const [artistKeyword, setArtistKeyword] = useState('');
  const [artistSearchResults, setArtistSearchResults] = useState([]);
  const [isArtistSearchLoading, setIsArtistSearchLoading] = useState(false);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearchArtist();
    }
  };

  const handleSearchArtist = async () => {
    const keyword = artistKeyword.trim();

    if (!keyword) {
      setArtistSearchResults([]);
      onResetSelectedSearchArtist();

      notification.warning({
        message: '확인해주세요.',
        description: '검색할 아티스트 이름을 입력해주세요.',
        placement: 'topRight',
        duration: 4.5,
      });

      return;
    }

    try {
      setIsArtistSearchLoading(true);

      const result = await VerifyService.searchArtists({
        keyword,
        size: 20,
      });

      const searchedArtists = result?.artists ?? [];

      setArtistSearchResults(searchedArtists);
      onResetSelectedSearchArtist();

      if (searchedArtists.length === 0) {
        notification.info({
          message: '안내',
          description: '검색된 아티스트가 없습니다.',
          placement: 'topRight',
          duration: 4.5,
        });
      }
    } catch (error) {
      console.error('아티스트 검색 실패:', error);

      setArtistSearchResults([]);

      notification.error({
        message: '오류가 발생했습니다.',
        description:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          '아티스트 검색에 실패했습니다.',
        placement: 'topRight',
        duration: 4.5,
      });
    } finally {
      setIsArtistSearchLoading(false);
    }
  };

  const handleArtistKeywordChange = (keyword) => {
    setArtistKeyword(keyword);

    if (selectedSearchArtist) {
      onResetSelectedSearchArtist();
    }
  };

  return (
    <>
      <div className="artist-search">
        <div className="search-input">
          <input
            type="text"
            placeholder="아티스트로 찾아볼까요?"
            value={artistKeyword}
            onChange={(event) => handleArtistKeywordChange(event.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button
            type="button"
            className="icon"
            onClick={handleSearchArtist}
            disabled={isArtistSearchLoading}
          >
            <MagnifyingGlassIcon />
          </button>
        </div>
      </div>

      {!selectedSearchArtist && (
        <>
          {isArtistSearchLoading ? (
            <div className="artist-search-results">
              <p className="artist-search-loading">검색 중...</p>
            </div>
          ) : artistSearchResults.length > 0 ? (
            <div className="artist-search-results">
              <ul className="artist-list">
                {artistSearchResults.map((artist) => (
                  <li key={artist.id} className="artist">
                    <button
                      type="button"
                      onClick={() => onSelectSearchArtist(artist)}
                    >
                      <div className="image">
                        <img src={artist.pictureUrl} alt={artist.name} />
                      </div>

                      <p className="name">{artist.name}</p>

                      {artist.alias && (
                        <p className="group ellipsis-2">{artist.alias}</p>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : artistKeyword.trim() ? (
            <div className="artist-search-results">
              <p className="empty-result">검색 결과가 없습니다.</p>
            </div>
          ) : null}
        </>
      )}

      {selectedSearchArtist && (
        <div className="artist-content-search-result">
          <button
            type="button"
            className="selected-search-artist"
            onClick={onResetSelectedSearchArtist}
          >
            <div className="image">
              <img
                src={selectedSearchArtist.pictureUrl}
                alt={selectedSearchArtist.name}
              />
            </div>

            <div className="info">
              <p className="name">{selectedSearchArtist.name}</p>

              {selectedSearchArtist.alias && (
                <p className="alias">{selectedSearchArtist.alias}</p>
              )}
            </div>
          </button>

          <hr />

          <p className="artist-content-description">
            선택하신 아티스트와 장소에 해당하는 콘텐츠예요.
          </p>

          {isArtistSearchLoading && (
            <div className="artist-content-loading">
              <span className="spinner" />
            </div>
          )}

          {!isArtistSearchLoading && searchedArtistContents.length > 0 && (
            <ul className="artist-content-list">
              {searchedArtistContents.map((content) => {
                const selected =
                  selectedContent?.contentId === content.contentId;

                return (
                  <li
                    key={content.contentId}
                    className={selected ? 'selected' : ''}
                  >
                    <button
                      type="button"
                      onClick={() => onSelectContent(content)}
                    >
                      <div className="content-main">
                        <div className="image">
                          <img
                            src={content.contentPictureUrl}
                            alt={content.contentTitle}
                          />
                        </div>

                        <div className="content-info">
                          <span className="tag">
                            {getContentCategoryLabel(content.contentCategory)}
                          </span>

                          <p className="title">{content.contentTitle}</p>
                        </div>
                      </div>

                      <span
                        className={`select-text ${selected ? 'selected' : ''}`}
                      >
                        선택
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {!isArtistSearchLoading && searchedArtistContents.length === 0 && (
            <p className="empty-content-result">
              선택하신 아티스트와 이 장소에 해당하는 콘텐츠가 없습니다.
            </p>
          )}
        </div>
      )}
    </>
  );
}

export default ArtistSearch;
