import PlaceCard from '../../card/PlaceCard';
import { LOCATION_CATEGORY_OPTIONS } from '@/constants/rankingConstants.js';

const getLocationCategoryLabel = (category) =>
  LOCATION_CATEGORY_OPTIONS.find((option) => option.value === category)
    ?.label ?? category;

function PlaceSelectStep({ locations, selectedLocation, onSelectLocation }) {
  return (
    <section className="step-2">
      <div className="map">지도 위치</div>

      <div className="container">
        <h2>방문 인증할 장소를 선택해주세요.</h2>

        <ul className="card-list">
          {locations.map((location) => (
            <PlaceCard
              key={location.id}
              className={selectedLocation?.id === location.id ? 'selected' : ''}
              tag={getLocationCategoryLabel(location.category)}
              title={location.name}
              description={location.address}
              imageUrl={location.mainImageUrl}
              onClick={() => onSelectLocation(location)}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default PlaceSelectStep;
