import { Link } from "react-router-dom";
import {
  CaretRightIcon,
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
          {/* filter components 작업 예정 */}
          <div className="filter">필터 위치</div>
          <div className="contents-count">NNN 건</div>
          <ul className="card-list">
            {/* MEMO: 컴포넌트로 빼두었으며, 해당 컴포넌트는
            아티스트 홈 > 여행지, 아티스트 홈 > 미디어 탭 > 특정 미디어 여행지, 미디어 홈 > 여행지 탭에서
            description만 차이를 두고 활용됩니다.  */}
            <PlaceCard />
            {/* MEMO: 컴포넌트로 빼두었으며, 해당 컴포넌트는
            아티스트 홈 > 미디어 탭 에서 두 가지 경우로 활용됩니다. */}
            <MediaCard />
          </ul>
        </section>
      </div>
    </main>
  );
}

export default ContentDetail;
