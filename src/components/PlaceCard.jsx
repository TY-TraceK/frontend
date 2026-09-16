import { Link } from 'react-router-dom';
import { MapPinSimpleAreaIcon } from '@phosphor-icons/react';
import './Card.css';

function PlaceCard({
  className = '',
  tag,
  onClick,
  title,
  verifyCount,
  description,
  imageUrl,
}) {
  return (
    <li className={`item place ${className}`}>
      <Link onClick={onClick}>
        <div className="image">
          <img src={imageUrl} alt="" />
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
