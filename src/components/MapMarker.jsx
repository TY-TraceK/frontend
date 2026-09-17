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
  CULTURAL_FACILITY: BankIcon,
  FESTIVAL: ConfettiIcon,
  FILMING_LOCATION: FilmSlateIcon,
  RESTAURANT: ForkKnifeIcon,
  CAFE: CoffeeIcon,
  ACCOMMODATION: BedIcon,
  SHOPPING: ShoppingBagOpenIcon,
  ETC: AsteriskIcon,
};

const MapMarker = ({ variant = 'default', category, name, count }) => {
  const CategoryIcon = CATEGORY_ICONS[category];

  // variant: {default: 기본형으로 이름 + 마커, compact: 축약형으로 점만 제공, bookmark: 점 대신 마커}
  // default 기준: 1. 한 페이지 10개 이내일 때 전체 표시, 2. 11개 이상일 때 방문 인증 수 상위 5개만 표시

  if (variant === 'compact') {
    return <span className="map-marker compact" />;
  }

  return (
    //   MEMO: 특정 장소 선택될 시 active 클래스 추가 바랍니다.
    //   category 클래스는 대문자로 잡아두었습니다. enum 그대로 들어오면 됩니다.
    <div className={`map-marker ${variant} ${category}`}>
      <span className="icon">{CategoryIcon && <CategoryIcon />}</span>

      {variant === 'default' && name && (
        <span className="name ellipsis-2">
          {name}
          {count > 0 && ` +${count}`}
        </span>
      )}
    </div>
  );
};

export default MapMarker;
