import ImagePlaceholder from '../ImagePlaceholder';
import { CaretDownIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';

import MediaCard from '../MediaCard';
import ArtistSearch from '../ArtistSearch';
import { CONTENT_CATEGORY_OPTIONS } from '@/constants/rankingConstants.js';

const getContentCategoryLabel = (category) =>
  CONTENT_CATEGORY_OPTIONS.find((option) => option.value === category)?.label ??
  category;

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
  onSubmitLocationOnly,
  isLoading,
}) {
  return (
    <section className="step-3">
      <div className="container">
        <div className="verify-selected">
          <div className="place row">
            <div className="image">
              {selectedLocation?.mainImageUrl ? (
                <img src={selectedLocation.mainImageUrl} alt="" />
              ) : (
                <ImagePlaceholder type="card" />
              )}
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

              {relatedContents.length === 0 ? (
                <div className="empty-content-result">
                  <p>등록된 콘텐츠가 없습니다.</p>
                  <button
                    type="button"
                    className="location-only-link"
                    onClick={onSubmitLocationOnly}
                    disabled={isLoading}
                  >
                    장소만 선택하고 넘어가기
                  </button>
                </div>
              ) : (
                <ul className="card-list">
                  {relatedContents.map((content) => (
                    <MediaCard
                      key={content.contentId}
                      className={
                        selectedContent?.contentId === content.contentId
                          ? 'selected'
                          : ''
                      }
                      tag={getContentCategoryLabel(content.contentCategory)}
                      title={content.contentTitle}
                      imageUrl={content.contentPictureUrl}
                      onClick={() => onSelectContent(content)}
                    />
                  ))}
                </ul>
              )}
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
