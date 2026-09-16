import { MagnifyingGlassIcon } from '@phosphor-icons/react';

function ArtistSearch({
  artistKeyword,
  onArtistKeywordChange,
  artistSearchResults,
  isArtistSearchLoading,
  onSearchArtist,

  selectedSearchArtist,
  onSelectSearchArtist,
  onResetSelectedSearchArtist,

  searchedArtistContents,
  selectedContent,
  onSelectContent,
}) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSearchArtist();
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
            onChange={(event) => onArtistKeywordChange(event.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button
            type="button"
            className="icon"
            onClick={onSearchArtist}
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
                          <span className="tag">{content.contentCategory}</span>

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
