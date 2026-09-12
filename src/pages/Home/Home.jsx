import { useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import {
  BookmarkSimpleIcon,
  CaretRightIcon,
  MapPinIcon,
  MapPinSimpleAreaIcon,
} from "@phosphor-icons/react";
import "./Home.css";

function Home() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <main className="home">
      <div className="container">
        {/* MEMO: 로그인 유도 섹션으로 비회원에게만 노출 */}
        <section className="login-prompt">
          <p>
            {/* MEMO: 로그인 클릭 시, 로그인 페이지로 이동 */}
            <span className="accent-text">로그인</span>하고
          </p>
          <p>좋아하는 콘텐츠를 저장해보세요!</p>
        </section>
        {/* MEMO: 로그인 후 변경 형태 - 해당 섹션 제외 비회원 모두 이용 가능*/}
        <section className="personalized-content">
          <div className="title">
            <p>
              <span className="accent-text">닉네임</span> 님,
            </p>
            <p>오늘은 어떤 화면 속으로 여행 가볼까요?</p>
          </div>

          <div className="banner">
            <Link>
              {/* MEMO: 팬인 아티스트/미디어 콘텐츠 중 여행지가 추가된 내역이 있다면,
                아티스트/미디어 콘텐츠 홈으로 이동 */}
              팬인 콘텐츠에 새로운 여행지가 추가됐어요.
              <span className="icon">
                <CaretRightIcon />
              </span>
            </Link>
          </div>
        </section>
        <section className="new-contents">
          <h2>새로운 콘텐츠를 통해 여행지를 찾아보세요!</h2>

          <ul className="tabs">
            {/* MEMO: 탭 클릭하여 콘텐츠 변경 시, tab에 selected 클래스 추가 */}
            <li className="tab selected">드라마</li>
            <li className="tab">영화</li>
            <li className="tab">예능</li>
            <li className="tab">뮤직비디오</li>
          </ul>

          <ul className="list">
            <li className="poster">
              {/* MEMO: 클릭 시 각 미디어 홈으로 이동 */}
              <Link>
                <img src="https://picsum.photos/id/912/400/600" alt="" />
              </Link>
            </li>
            <li className="poster">
              <Link>
                <img src="https://picsum.photos/id/508/400/600" alt="" />
              </Link>
            </li>
            <li className="poster">
              <Link>
                <img src="https://picsum.photos/id/1015/400/600" alt="" />
              </Link>
            </li>
          </ul>
        </section>
        <section className="hero">
          <div className="header">
            <h2>오늘은 어디로 여행을 떠나볼까요?</h2>

            <button className="location-selector">
              {/* MEMO: 클릭 시, 현재 다른 지역 준비중 alert - taost component 만든 후 변경 */}
              <span className="icon">
                <MapPinIcon />
              </span>
              <span>부산광역시</span>
            </button>
          </div>

          <div className="indicator">
            {/* MEMO: 03 위치에 슬라이드 값이 들어와야 하며, 최대 5개 희망 */}
            <span className="accent-text">
              {String(activeIndex + 1).padStart(2, "0")}{" "}
            </span>
            / 03
          </div>

          <div className="slider">
            <Swiper
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            >
              <SwiperSlide>
                <div className="card relative">
                  <button className="bookmark icon">
                    {/* MEMO: 클릭시 북마크 아이콘이 fill 상태로 변경 toast로 저장되었다는 건 추후 적용 예정 */}
                    <BookmarkSimpleIcon />
                  </button>

                  <Link className="link">
                    {/* MEMO: 클릭 시 각 여행지 상세 페이지로 이동 */}
                    <div className="image">
                      <img src="https://picsum.photos/id/52/600/400" alt="" />
                    </div>

                    <div className="info">
                      <div className="info-header">
                        <p className="location-name">송도해수욕장</p>

                        <div className="count">
                          <span className="icon">
                            <MapPinSimpleAreaIcon />
                          </span>
                          <span>2.4천 건</span>
                        </div>
                      </div>

                      <div className="chip-list">
                        {/* 해당 장소 인증 많은 미디어 콘텐츠 최대 4개 */}
                        <span className="chip">런닝맨</span>
                        <span className="chip">스테이씨, 떴다!</span>
                        <span className="chip">깡철이</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="card relative">
                  <button className="bookmark icon">
                    <BookmarkSimpleIcon />
                  </button>

                  <Link className="link">
                    <div className="image">
                      <img src="https://picsum.photos/id/53/600/400" alt="" />
                    </div>

                    <div className="info">
                      <div className="info-header">
                        <p className="location-name">송도해수욕장</p>

                        <div className="count">
                          <span className="icon">
                            <MapPinSimpleAreaIcon />
                          </span>
                          <span>2.4천 건</span>
                        </div>
                      </div>

                      <div className="chip-list">
                        <span className="chip">런닝맨</span>
                        <span className="chip">스테이씨, 떴다!</span>
                        <span className="chip">깡철이</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div className="card relative">
                  <button className="bookmark icon">
                    <BookmarkSimpleIcon />
                  </button>

                  <Link className="link">
                    <div className="image">
                      <img src="https://picsum.photos/id/54/600/400" alt="" />
                    </div>

                    <div className="info">
                      <div className="info-header">
                        <p className="location-name">송도해수욕장</p>

                        <div className="count">
                          <span className="icon">
                            <MapPinSimpleAreaIcon />
                          </span>
                          <span>2.4천 건</span>
                        </div>
                      </div>

                      <div className="chip-list icon">
                        <span className="chip">런닝맨</span>
                        <span className="chip">스테이씨, 떴다!</span>
                        <span className="chip">깡철이</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </section>
        <section className="archive-banner">
          <Link>
            {/* MEMO: 클릭 시 아카이브 페이지로 이동 */}
            <p>오늘 하루 어디 다녀왔는지, 한 눈에 확인하는 방법!</p>
            <p className="emphasis">방문 인증으로 만들어지는 나만의 타임라인</p>

            <span className="accent-text">
              자세히 알아보기
              <span className="icon">
                <CaretRightIcon />
              </span>
            </span>
          </Link>
        </section>
        <section className="location-ranking">
          <ul className="ranking-list">
            <li className="ranking-card relative">
              <Link>
                {/* MEMO: 클릭 시, 여행지 상세 페이지로 이동 */}
                <div className="image">
                  <img src="https://picsum.photos/id/60/600/400" alt="" />
                </div>

                <span className="number">1</span>

                <div className="info">
                  <p className="location-name emphasis">송도해상케이블카</p>
                  <p className="count">
                    <span className="icon">
                      <MapPinSimpleAreaIcon />
                    </span>
                    <span>2,419건</span>
                  </p>
                </div>
              </Link>
            </li>

            <li className="ranking-card relative">
              <Link>
                <div className="image">
                  <img src="https://picsum.photos/id/61/600/400" alt="" />
                </div>

                <span className="number">2</span>

                <div className="info">
                  <p className="location-name emphasis">송정해수욕장</p>
                  <p className="count">
                    <span className="icon">
                      <MapPinSimpleAreaIcon />
                    </span>
                    <span>1,805건</span>
                  </p>
                </div>
              </Link>
            </li>

            <li className="ranking-card relative">
              <Link>
                <div className="image">
                  <img src="https://picsum.photos/id/62/600/400" alt="" />
                </div>

                <span className="number">3</span>

                <div className="info">
                  <p className="location-name emphasis">흰여울마을</p>
                  <p className="count">
                    <span className="icon">
                      <MapPinSimpleAreaIcon />
                    </span>
                    <span>901건</span>
                  </p>
                </div>
              </Link>
            </li>
          </ul>

          <Link className="ranking-link accent-text">
            {/* MEMO: 여행지 실시간 순위 페이지로 이동 */}
            여행지 실시간 순위 더보기
            <CaretRightIcon />
          </Link>
        </section>
        <section className="content-curator">
          {/* MEMO: 큐레이션 섹션 진행할 건지 논의 필요함. 잠시 보류해주세요. 감사합니다! */}
          <Link className="link">
            <p>🎬 이 콘텐츠를 따라 떠나볼까요?</p>

            <h3>'런닝맨' 속 부산 여행</h3>

            <p className="route">
              <span>송도해수욕장</span>
              <span>송도해상케이블카</span>
              <span>흰여울문화마을</span>
            </p>

            <span className="more accent-text">
              여행지 더보기
              <span className="icon">
                <CaretRightIcon />
              </span>
            </span>
          </Link>
        </section>
      </div>
    </main>
  );
}

export default Home;
