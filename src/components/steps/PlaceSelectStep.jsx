import PlaceCard from '../PlaceCard';
import { LOCATION_CATEGORY_OPTIONS } from '@/constants/rankingConstants.js';

const getLocationCategoryLabel = (category) =>
  LOCATION_CATEGORY_OPTIONS.find((option) => option.value === category)?.label ??
  category;

function PlaceSelectStep({
  locations,
  selectedLocation,
  onSelectLocation,
  title = '방문 인증할 장소를 선택해주세요.',
  showMap = true,
}) {
  return (
    <section className="step-2">
      {showMap && <div className="map">지도 위치</div>}

      <div className="container">
        <h2>{title}</h2>

        <ul className="card-list">
          {locations.map((location) => (
            <PlaceCard
              key={location.id ?? location.name}
              className={(selectedLocation?.id ?? selectedLocation?.name) === (location.id ?? location.name) ? 'selected' : ''}
              tag={location.category ? getLocationCategoryLabel(location.category) : undefined}
              title={location.name}
              description={location.address ?? `${location.latitude}, ${location.longitude}`}
              imageUrl={location.mainImageUrl ?? location.imageUrl}
              onClick={() => onSelectLocation(location)}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default PlaceSelectStep;
