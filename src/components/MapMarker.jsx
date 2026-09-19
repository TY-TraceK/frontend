import {
  AsteriskIcon,
  BankIcon,
  BedIcon,
  CoffeeIcon,
  ConfettiIcon,
  ForkKnifeIcon,
  FilmSlateIcon,
  ShoppingBagOpenIcon,
  SynagogueIcon,
} from '@phosphor-icons/react';

import './MapMarker.css';

const CATEGORY_ICONS = {
  ATTRACTION: SynagogueIcon,
  CULTURE: BankIcon,
  FESTIVAL: ConfettiIcon,
  FILMING_LOCATION: FilmSlateIcon,
  RESTAURANT: ForkKnifeIcon,
  CAFE: CoffeeIcon,
  ACCOMMODATION: BedIcon,
  SHOPPING: ShoppingBagOpenIcon,
  ETC: AsteriskIcon,
};

const MapMarker = ({
  variant = 'default',
  category,
  name,
  count,
  isActive = false,
}) => {
  const CategoryIcon = CATEGORY_ICONS[category];
  const displayVariant = isActive ? 'default' : variant;

  // variant:
  // default: 기본형으로 이름 + 마커
  // compact: 축약형으로 점만 제공
  // bookmark: 점 대신 마커
  //
  // default 기준:
  // 1. 한 페이지 10개 이내일 때 전체 표시
  // 2. 11개 이상일 때 방문 인증 수 상위 5개만 표시

  if (displayVariant === 'compact') {
    return <span className="map-marker compact" />;
  }

  return (
    <div
      className={`map-marker ${displayVariant} ${category} ${
        isActive ? 'active' : ''
      }`}
    >
      <span className="icon">{CategoryIcon && <CategoryIcon />}</span>

      {displayVariant === 'default' && name && (
        <span className="name ellipsis-2">
          {name}
          {count > 0 && ` +${count}`}
        </span>
      )}
    </div>
  );
};

export default MapMarker;
