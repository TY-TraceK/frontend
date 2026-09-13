import { Link } from "react-router-dom";
import {
  CaretRightIcon,
  HouseIcon,
  PlayCircleIcon,
  SignpostIcon,
  StarIcon,
} from "@phosphor-icons/react";
import PlaceCard from "../../components/PlaceCard";
import MediaCard from "../../components/MediaCard";
import "./ContentDetail.css";

function ContentDetail() {
  return (
    //   MEMO: Main에 class로 artist, media 구분 한 번 들어오게 부탁드립니다.
    <main className="content-detail">
      <section className="hero image">
        <img src="https://picsum.photos/id/216/400/600" alt="" />
      </section>
      <div className="container">
        <section className="content-summary relative">
          {/* MEMO: 클릭 시, 팬이 되었습니다 alert + StarIcon Fill */}
          <button className="floating">
            <span className="icon star">
              <StarIcon />
            </span>
            <span className="fan-count">N,NNN명</span>
          </button>
          <p className="verify-total-count accent-text">
            CONTENT 팬들의 방문 인증 총 N,NNN건
          </p>
          <h2>CONTENT NAME</h2>
          <div className="content-stats">
            <div className="location-count">
              <span className="icon">
                <SignpostIcon weight="fill" />
              </span>
              <span>관련 여행지 nnn 곳</span>
            </div>
            <div className="media-count">
              <span className="icon">
                <PlayCircleIcon weight="fill" />
              </span>
              <span>관련 미디어 nnn 개</span>
            </div>
          </div>
        </section>
        <section className="affiliation-list relative">
          {/* MEMO: 소속 그룹, 소속 멤버, 소속 고정 출연진 영역 */}
          <div className="list-wrapper">
            <ul className="list">
              {/* MEMO: 첫번째 li로 렌더링 진행 바랍니다. */}
              <li className="item">
                <Link>
                  <div className="image">
                    <img src="https://picsum.photos/id/237/400/600" alt="" />
                  </div>
                  <span className="name ellipsis-2">
                    NAME NAME NAME NAME NAME NAME
                  </span>
                </Link>
              </li>
              <li className="item">
                <Link>
                  <div className="image">
                    <img src="https://picsum.photos/id/238/400/600" alt="" />
                  </div>
                  <span className="name">NAME</span>
                </Link>
              </li>
              <li className="item">
                <Link>
                  <div className="image">
                    <img src="https://picsum.photos/id/239/400/600" alt="" />
                  </div>
                  <span className="name">NAME</span>
                </Link>
              </li>
              <li className="item">
                <Link>
                  <div className="image">
                    <img src="https://picsum.photos/id/240/400/600" alt="" />
                  </div>
                  <span className="name">NAME</span>
                </Link>
              </li>
              <li className="item">
                <Link>
                  <div className="image">
                    <img src="https://picsum.photos/id/241/400/600" alt="" />
                  </div>
                  <span className="name">NAME</span>
                </Link>
              </li>
              <li className="item">
                <Link>
                  <div className="image">
                    <img src="https://picsum.photos/id/242/400/600" alt="" />
                  </div>
                  <span className="name">NAME</span>
                </Link>
              </li>
            </ul>
            {/* MEMO: 6개 넘어갈 때 노출 */}
            <button
              type="button"
              className="next-button"
              aria-label="다음 항목 보기"
            >
              <CaretRightIcon />
            </button>
          </div>
        </section>
        <section className="related-contents">
          <div className="tabs">
            {/* MEMO: 미디어 홈에서는 탭이 아예 안 보입니다. */}
            <div className="tab location selected">여행지</div>
            <div className="tab media">미디어</div>
          </div>
          {/* MEMO:
            고정 출연진인 경우 media-meta를 hidden 처리합니다.
            고정 출연진이 아닌 경우 특정 미디어 상세에서만 노출합니다.
          */}
          <div className="media-meta">
            <h4 className="media-title ellipsis-1">미디어 제목</h4>
            <Link className="shortcut">
              <span className="icon">
                <HouseIcon />
              </span>
              <span>미디어 제목 홈</span>
            </Link>
          </div>
          {/* filter components 작업 예정 */}
          <div className="filter">필터 위치</div>
          <div className="contents-count">NNN 건</div>
          <ul className="card-list">
            <PlaceCard
              tag="부산광역시"
              title="송도해수욕장"
              verifyCount={127}
              description="런닝맨"
            />
            {/* 고정 예능일 때 */}
            <MediaCard tag="예능" title="런닝맨" showShortcut="true" />
            {/* 게스트 예능일 때 */}
            <MediaCard
              tag="예능"
              title="구해줘! 홈즈"
              showDescription="true"
              description="여행지 6곳"
            />
            {/* 미디어 탭에서 특정 미디어 상세 페이지일 때 */}
            <PlaceCard
              tag="부산광역시"
              title="송도해수욕장"
              verifyCount={127}
              description="126회 최지우 vs 런닝맨"
            />
          </ul>
        </section>
      </div>
    </main>
  );
}

export default ContentDetail;
