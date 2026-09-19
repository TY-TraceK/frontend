import { Link } from 'react-router-dom';
import ImagePlaceholder from '../common/ImagePlaceholder';
import './Card.css';
import { HouseIcon } from '@phosphor-icons/react';

function MediaCard({
  className = '',
  tag,
  title,
  imageUrl,
  onClick,
  description,
  showShortcut = false,
  showDescription = true,
}) {
  return (
    <li className={`item media ${className}`}>
      <Link
        onClick={(event) => {
          event.preventDefault();
          onClick?.(event);
        }}
      >
        {/* MEMO: 예능 고정 출연진일 때, 미디어 홈으로 바로가기 */}
        <div className="image">
          {imageUrl ? (
            <img src={imageUrl} alt="" />
          ) : (
            <ImagePlaceholder type="card" />
          )}
        </div>
        <div className="item-info">
          <span className="tag">{tag}</span>
          <div className="title-row">
            <h3 className="ellipsis-1">{title}</h3>
            {/* MEMO: 하단 shortcut은 예능 고정 출연진일 때만 노출 */}
            {showShortcut && (
              <div className="shortcut accent-text">
                <span className="icon">
                  <HouseIcon />
                </span>
                <span className="shortcut-text">바로가기</span>
              </div>
            )}
          </div>
          {/* MEMO: 고정 출연진이 아닐 때만 노출 */}
          {showDescription && (
            <p className="description ellipsis-1">{description}</p>
          )}
        </div>
      </Link>
    </li>
  );
}

export default MediaCard;
