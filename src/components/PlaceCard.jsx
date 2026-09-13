import { Link } from "react-router-dom";
import { MapPinSimpleAreaIcon } from "@phosphor-icons/react";
import "./Card.css";

// TODO: 기존 디자인에서는 플레이스 카드가 이동의 역할을 하여, Link로 잡아두었으나,
// VerifyModal에서 사용되어 Link 부분 처리 필요함
function PlaceCard({ className = "", tag, title, verifyCount, description }) {
  return (
    <li className={`item place ${className}`}>
      <Link>
        <div className="image">
          <img src="https://picsum.photos/id/312/400/600" alt="" />
        </div>
        <div className="item-info">
          <span className="tag">{tag}</span>
          <div className="title-row">
            <h3 className="ellipsis-1">{title}</h3>
            {verifyCount !== undefined && (
              <div className="verify-count accent-text">
                <span className="icon">
                  <MapPinSimpleAreaIcon />
                </span>
                <span className="count">{verifyCount}건</span>
              </div>
            )}
          </div>
          <p className="description ellipsis-1">{description}</p>
        </div>
      </Link>
    </li>
  );
}

export default PlaceCard;
