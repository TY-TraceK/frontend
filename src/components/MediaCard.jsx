import { Link } from "react-router-dom";
import "./Card.css";
import { HouseIcon } from "@phosphor-icons/react";

function MediaCard() {
  return (
    <li className="item media">
      <Link>
        {/* MEMO: 예능 고정 출연진일 때, 미디어 홈으로 바로가기 */}
        <div className="image">
          <img src="https://picsum.photos/id/410/400/600" alt="" />
        </div>
        <div className="item-info">
          <span className="media-type tag">예능</span>
          <div className="title-row">
            <h3 className="ellipsis-1">미디어 이름</h3>
            {/* MEMO: 하단 shortcut은 예능 고정 출연진일 때만 노출 */}
            <div className="shortcut accent-text">
              <span className="icon">
                <HouseIcon />
              </span>
              <span className="count">바로가기</span>
            </div>
          </div>
          {/* MEMO: 고정 출연진이 아닐 때만 노출 */}
          <p className="description ellipsis-1">여행지 NNN 곳</p>
        </div>
      </Link>
    </li>
  );
}

export default MediaCard;
