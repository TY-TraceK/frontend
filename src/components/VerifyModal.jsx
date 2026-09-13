import { useEffect } from "react";
import "./VerifyModal.css";
import PlaceCard from "./PlaceCard";

function VerifyModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <main className="verify-modal">
      <div className="step-1">
        <div className="map">지도 위치</div>
        <div className="container">
          <h2>방문 인증할 장소를 선택해주세요.</h2>
          <ul className="card-list">
            <PlaceCard />
          </ul>
        </div>
      </div>
      <div className="actions">
        <button className="neutral" onClick={onClose}>
          닫기
        </button>
        <button className="active">다음</button>
      </div>
    </main>
  );
}

export default VerifyModal;
