import VerificationMap from '../VerificationMap';

function PlaceSelectStep({
  locations,
  selectedLocation,
  selectedPosition,
  onSelectLocation,
  onSkipDetails,
}) {
  return (
    <section className="step-2">
      {selectedPosition && (
        <VerificationMap
          latitude={selectedPosition.latitude}
          longitude={selectedPosition.longitude}
          initialZoom={2}
        />
      )}

      <div className="container">
        <h2>
          {locations.length > 0
            ? '테스트할 위치를 선택해주세요.'
            : '현재 위치에서 방문 인증할 장소를 선택해주세요.'}
        </h2>

        {locations.length > 0 && (
          <ul className="verification-location-list">
            {locations.map((location) => (
              <li key={location.name}>
                <button
                  type="button"
                  className={selectedLocation?.name === location.name ? 'selected' : ''}
                  onClick={() => onSelectLocation(location)}
                >
                  <div className="image">
                    {location.imageUrl && <img src={location.imageUrl} alt="" />}
                  </div>
                  <span>{location.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {selectedLocation && (
          <button type="button" className="skip-detail-link" onClick={onSkipDetails}>
            장소만 선택하고 바로 제출하기
          </button>
        )}
      </div>
    </section>
  );
}

export default PlaceSelectStep;
