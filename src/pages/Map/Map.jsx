import { useRef } from 'react';
import './Map.css';
import {
  AsteriskIcon,
  BankIcon,
  BedIcon,
  BookmarkSimpleIcon,
  ClockIcon,
  CoffeeIcon,
  ConfettiIcon,
  ForkKnifeIcon,
  FilmSlateIcon,
  MapPinIcon,
  ShoppingBagOpenIcon,
  SynagogueIcon,
} from '@phosphor-icons/react';

function Map() {
  const chipsRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleChipPointerDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX;
    scrollLeft.current = chipsRef.current.scrollLeft;
  };

  const handleChipPointerMove = (e) => {
    if (!isDragging.current) return;

    const deltaX = e.clientX - startX.current;
    chipsRef.current.scrollLeft = scrollLeft.current - deltaX;
  };

  const handleChipPointerUp = () => {
    isDragging.current = false;
  };

  return (
    <main className="map">
      <div className="map-area"></div>
      <div className="frame">
        <div className="container">
          <div
            ref={chipsRef}
            className="chips"
            onPointerDown={handleChipPointerDown}
            onPointerMove={handleChipPointerMove}
            onPointerUp={handleChipPointerUp}
            onPointerLeave={handleChipPointerUp}
          >
            {/* MEMO: 특정 칩 선택되면 button에 클래스 active 추가 바랍니다. */}
            <button className="chip attraction active">
              <span className="icon">
                <SynagogueIcon />
                <span className="category">관광지/명소</span>
              </span>
            </button>

            <button className="chip culture">
              <span className="icon">
                <BankIcon />
                <span className="category">문화시설</span>
              </span>
            </button>

            <button className="chip event">
              <span className="icon">
                <ConfettiIcon />
                <span className="category">축제/행사</span>
              </span>
            </button>

            <button className="chip filming">
              <span className="icon">
                <FilmSlateIcon />
                <span className="category">촬영지</span>
              </span>
            </button>

            <button className="chip restaurant">
              <span className="icon">
                <ForkKnifeIcon />
                <span className="category">음식점</span>
              </span>
            </button>

            <button className="chip cafe">
              <span className="icon">
                <CoffeeIcon />
                <span className="category">카페</span>
              </span>
            </button>

            <button className="chip accommodation">
              <span className="icon">
                <BedIcon />
                <span className="category">숙박</span>
              </span>
            </button>

            <button className="chip shopping">
              <span className="icon">
                <ShoppingBagOpenIcon />
                <span className="category">쇼핑</span>
              </span>
            </button>

            <button className="chip other">
              <span className="icon">
                <AsteriskIcon />
                <span className="category">기타</span>
              </span>
            </button>
          </div>
        </div>

        <button className="floating bookmark icon">
          <BookmarkSimpleIcon />
        </button>

        <section className="place-sheet">
          <div className="place-list">
            <button className="sheet-handle" aria-label="바텀시트 조절">
              <span></span>
            </button>

            <article className="item">
              <div className="image">
                <img src="https://picsum.photos/id/10/600/400" alt="" />
              </div>

              <div className="place-info">
                <div className="meta">
                  <span className="category">관광지/명소</span>
                  <span className="verify-count accent-text">
                    방문 인증 1,279 건
                  </span>
                </div>

                <h2>송도해수욕장</h2>

                <div className="business-hours-info">
                  <span className="icon">
                    <ClockIcon weight="fill" />
                  </span>
                  <p className="info">
                    <span className="start-time">06:00</span>
                    <span className="close-time">23:00</span>
                    <span className="additional">연중무휴</span>
                  </p>
                </div>

                <div className="address-info">
                  <span className="icon">
                    <MapPinIcon weight="fill" />
                  </span>
                  <p className="info">
                    <span className="address">
                      부산광역시 서구 송도해변로 100
                    </span>
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Map;
