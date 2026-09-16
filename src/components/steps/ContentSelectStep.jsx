import { CaretDownIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';

import MediaCard from '../MediaCard';
import ArtistSearch from '../ArtistSearch';

function ContentSelectStep({
  selectedLocation,
  relatedContents,
  selectedContent,
  onSelectContent,

  isArtistSearch,
  onOpenArtistSearch,
  onCloseArtistSearch,

  selectedSearchArtist,
  onSelectSearchArtist,
  onResetSelectedSearchArtist,

  searchedArtistContents,
}) {
  return (
    <section className="step-3">
      <div className="container">
        <div className="verify-selected">
          <div className="place row">
            <div className="image">
              <img
                src={selectedLocation?.mainImageUrl}
                alt={selectedLocation?.name ?? ''}
              />
            </div>

            <p>장소: {selectedLocation?.name}</p>
          </div>
        </div>

        <hr />

        {!isArtistSearch && (
          <>
            <div className="artist-search-prompt" onClick={onOpenArtistSearch}>
              <p>미디어가 생각 안 난다면,</p>

              <div className="search-shape">
                <p>아티스트로 찾아볼까요?</p>

                <span className="icon">
                  <MagnifyingGlassIcon />
                </span>
              </div>
            </div>

            <div className="media-selection">
              <h2>방문 인증할 미디어를 선택해주세요.</h2>

              <ul className="card-list">
                {relatedContents.map((content) => (
                  <MediaCard
                    key={content.contentId}
                    className={
                      selectedContent?.contentId === content.contentId
                        ? 'selected'
                        : ''
                    }
                    tag={content.contentCategory}
                    title={content.contentTitle}
                    imageUrl={content.contentPictureUrl}
                    onClick={() => onSelectContent(content)}
                  />
                ))}
              </ul>
            </div>
          </>
        )}

        {isArtistSearch && (
          <>
            <ArtistSearch
              selectedSearchArtist={selectedSearchArtist}
              onSelectSearchArtist={onSelectSearchArtist}
              onResetSelectedSearchArtist={onResetSelectedSearchArtist}
              searchedArtistContents={searchedArtistContents}
              selectedContent={selectedContent}
              onSelectContent={onSelectContent}
            />

            <button
              type="button"
              className="media-selection-toggle"
              onClick={onCloseArtistSearch}
            >
              <span>방문 인증할 미디어</span>

              <span className="icon">
                <CaretDownIcon />
              </span>
            </button>
          </>
        )}
      </div>
    </section>
  );
}

export default ContentSelectStep;
