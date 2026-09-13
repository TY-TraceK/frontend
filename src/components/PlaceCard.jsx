import { Link } from "react-router-dom";
import { MapPinSimpleAreaIcon } from "@phosphor-icons/react";
import "./Card.css";

function PlaceCard({ tag, title, verifyCount, description }) {
  return (
    <li className="item place">
      <Link>
        <div className="image">
          <img src="https://picsum.photos/id/312/400/600" alt="" />
        </div>
        <div className="item-info">
          <span className="tag">{tag}</span>
          <div className="title-row">
            <h3 className="ellipsis-1">{title}</h3>
            <div className="verify-count accent-text">
              <span className="icon">
                <MapPinSimpleAreaIcon />
              </span>
              <span className="count">{verifyCount}건</span>
            </div>
          </div>
          <p className="description ellipsis-1">{description}</p>
        </div>
      </Link>
    </li>
  );
}

export default PlaceCard;
