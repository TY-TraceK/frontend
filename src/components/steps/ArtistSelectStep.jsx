import ImagePlaceholder from '../ImagePlaceholder';
import { CheckCircleIcon } from '@phosphor-icons/react';

function ArtistSelectStep({
  selectedLocation,
  selectedContent,

  fixedArtists,
  guestArtists,

  isAllFixedSelected,
  isArtistSelected,

  onSelectArtist,
  onSelectAllFixedArtists,
}) {
  return (
    <section className="step-4">
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

            <p>{selectedLocation?.name}</p>
          </div>

          <div className="media row">
            <div className="image">
              {selectedContent?.contentPictureUrl ? (
                <img src={selectedContent.contentPictureUrl} alt="" />
              ) : (
                <ImagePlaceholder type="card" />
              )}
            </div>

            <p>{selectedContent?.contentTitle}</p>
          </div>
        </div>

        <hr />

        <div className="artist-selection">
          <h2>방문 인증할 아티스트를 선택해주세요.</h2>

          {fixedArtists.length > 0 && (
            <div className="artist-group">
              <div className="group-header">
                <h3>고정 출연진</h3>

                <button
                  type="button"
                  className={`select-all ${
                    isAllFixedSelected ? 'selected' : ''
                  }`}
                  onClick={onSelectAllFixedArtists}
                >
                  <span className="icon">
                    <CheckCircleIcon
                      weight={isAllFixedSelected ? 'fill' : 'regular'}
                    />
                  </span>

                  <span>전체 선택</span>
                </button>
              </div>

              <ul className="artist-list">
                {fixedArtists.map((artist) => (
                  <li
                    key={artist.artistId}
                    className={`artist ${
                      isArtistSelected(artist.artistId) ? 'selected' : ''
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onSelectArtist(artist)}
                    >
                      <div className="image">
                        {artist.artistPictureUrl ? (
                          <img src={artist.artistPictureUrl} alt="" />
                        ) : (
                          <ImagePlaceholder type="card" />
                        )}
                      </div>

                      <span className="name">{artist.artistName}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {guestArtists.length > 0 && (
            <div className="artist-group">
              <h3>게스트</h3>

              <ul className="artist-list">
                {guestArtists.map((artist) => (
                  <li
                    key={artist.artistId}
                    className={`artist ${
                      isArtistSelected(artist.artistId) ? 'selected' : ''
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onSelectArtist(artist)}
                    >
                      <div className="image">
                        {artist.artistPictureUrl ? (
                          <img src={artist.artistPictureUrl} alt="" />
                        ) : (
                          <ImagePlaceholder type="card" />
                        )}
                      </div>

                      <span className="name">{artist.artistName}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ArtistSelectStep;
