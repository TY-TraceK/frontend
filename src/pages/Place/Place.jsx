import { Link } from "react-router-dom";
import {
  AsteriskIcon,
  BankIcon,
  BedIcon,
  BookmarkSimpleIcon,
  CaretRightIcon,
  ClockIcon,
  CoffeeIcon,
  ConfettiIcon,
  FilmSlateIcon,
  ForkKnifeIcon,
  HeartIcon,
  MapPinIcon,
  PhoneIcon,
  ShoppingCartIcon,
  SynagogueIcon,
} from "@phosphor-icons/react";
import "./Place.css";

function Place() {
  return (
    <main className="place">
      <section className="hero image">
        <img src="https://picsum.photos/id/913/400/600" alt="" />
      </section>
      <div className="container">
        <section className="place-summary relative">
          {/* MEMO: 플로팅 메뉴 두 개는 비회원 클릭시 회원만 이용 가능함 안내 후, 로그인 페이지로 이동 */}
          <button className="floating heart icon">
            <HeartIcon />
          </button>
          <button className="floating bookmark icon">
            <BookmarkSimpleIcon />
          </button>
          <div className="place-meta">
            <p className="category">
              <span className="icon">
                <SynagogueIcon />
              </span>
              <span className="plate-type">관광지/명소</span>
              {/* MEMO: 장소별 아이콘을 남겨두었습니다. 확인하시고 매핑 후 삭제 부탁드립니다. */}
              <div className="hidden">
                <BankIcon /> 문화시설
                <ConfettiIcon /> 축제/행사
                <FilmSlateIcon /> 촬영지
                <ForkKnifeIcon /> 음식점
                <CoffeeIcon /> 카페
                <BedIcon /> 숙박
                <ShoppingCartIcon /> 쇼핑
                <AsteriskIcon /> 기타
              </div>
            </p>
            <p className="verify-count accent-text">장소의 방문인증 수</p>
          </div>

          <h2>place name</h2>
          <p className="description">place description</p>
          <div className="place-stats">
            <div className="like-count">
              <span className="icon heart">
                <HeartIcon weight="fill" />
              </span>
              n,nnn 명이 좋아해요.
            </div>
            <div className="bookmark-count">
              <span className="icon bookmark">
                <BookmarkSimpleIcon weight="fill" />
              </span>
              n, nnn 명이 저장했어요.
            </div>
          </div>
        </section>
        <section className="place-info">
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
              <span className="address">부산광역시 서구 송도해변로 100</span>
              <Link className="additional accent-text">지도</Link>
            </p>
          </div>
          <div className="phone-info">
            <span className="icon">
              <PhoneIcon weight="fill" />
            </span>
            <p className="info">
              <span className="phone">051-240-4000</span>
              <button className="additional accent-text">복사</button>
            </p>
          </div>
        </section>
        <section className="related-media">
          <h3>이 장소와 관련된 미디어</h3>
          <div className="slider">
            <ul className="list">
              <li className="item">
                <Link>
                  <div className="image">
                    <img src="https://picsum.photos/id/153/400/600" alt="" />
                  </div>
                  <p className="ellipsis-2 media-title">media title</p>
                </Link>
              </li>

              <li className="item">
                <Link>
                  <div className="image">
                    <img src="https://picsum.photos/id/154/400/600" alt="" />
                  </div>
                  <p className="ellipsis-2 media-title">media title</p>
                </Link>
              </li>
              <li className="item">
                <Link>
                  <div className="image">
                    <img src="https://picsum.photos/id/230/400/600" alt="" />
                  </div>
                  <p className="ellipsis-2 media-title">media title</p>
                </Link>
              </li>
              <li className="item">
                <Link>
                  <div className="image">
                    <img src="https://picsum.photos/id/238/400/600" alt="" />
                  </div>
                  <p className="ellipsis-2 media-title">media title</p>
                </Link>
              </li>
            </ul>
            {/* MEMO: item이 5개 이상일 때 노출 */}
            <button type="button" className="next-button icon">
              <CaretRightIcon />
            </button>
          </div>
        </section>
        <section className="related-artist">
          <h3>이 장소와 관련된 아티스트</h3>
          <div className="slider">
            <ul className="list">
              <li className="item">
                <Link>
                  <div className="image">
                    <img src="https://picsum.photos/id/153/400/600" alt="" />
                  </div>
                  <p className="ellipsis-2 artist-title">artist title</p>
                </Link>
              </li>

              <li className="item">
                <Link>
                  <div className="image">
                    <img src="https://picsum.photos/id/154/400/600" alt="" />
                  </div>
                  <p className="ellipsis-2 artist-title">artist title</p>
                </Link>
              </li>
              <li className="item">
                <Link>
                  <div className="image">
                    <img src="https://picsum.photos/id/230/400/600" alt="" />
                  </div>
                  <p className="ellipsis-2 artist-title">artist title</p>
                </Link>
              </li>
              <li className="item">
                <Link>
                  <div className="image">
                    <img src="https://picsum.photos/id/238/400/600" alt="" />
                  </div>
                  <p className="ellipsis-2 artist-title">artist title</p>
                </Link>
              </li>
            </ul>
            <button type="button" className="next-button icon">
              <CaretRightIcon />
            </button>
          </div>
        </section>
        <section className="travel-cta">
          {/* MEMO: 지도로 이동하되 현재 위치 인근의 여행지 전체 로드 가능할까요? */}
          <Link>
            <span>여기로도 가볼까요?</span>
            <span className="accent-text">인근 여행지 보기</span>
          </Link>
        </section>
      </div>
    </main>
  );
}

export default Place;
