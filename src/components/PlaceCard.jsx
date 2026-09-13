import { Link } from "react-router-dom";
import { MapPinSimpleAreaIcon } from "@phosphor-icons/react";
import "./Card.css";

function PlaceCard() {
  return (
    <li className="item place">
      <Link>
        <div className="image">
          <img src="https://picsum.photos/id/312/400/600" alt="" />
        </div>
        <div className="item-info">
          <span className="location tag">부산광역시</span>
          <div className="title-row">
            <h3 className="ellipsis-1">송도해수욕장</h3>
            <div className="verify-count accent-text">
              <span className="icon">
                <MapPinSimpleAreaIcon />
              </span>
              <span className="count">742건</span>
            </div>
          </div>
          {/* MEMO: description은 페이지별 노출 값이 다릅니다.
            아티스트 홈 > 여행지 탭: '미디어 명'
            아티스트 홈 > 미디어 탭 > 특정 미디어 관련 여행지:
                콘텐츠 정보 수집 시트 기준 '콘텐츠 부가 정보'
            미디어 홈 > 여행지 탭:
                회차가 존재하면 '회차' 노출
            위의 경우 모두 해당 값이 없으면 hidden 클래스 추가 */}
          <p className="description ellipsis-1">런닝맨 126회</p>
        </div>
      </Link>
    </li>
  );
}

export default PlaceCard;
