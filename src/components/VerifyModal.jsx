import { useEffect, useState } from "react";
import "./VerifyModal.css";
import PlaceCard from "./PlaceCard";
import {
  CaretDownIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  XIcon,
} from "@phosphor-icons/react";
import MediaCard from "./MediaCard";

function VerifyModal({ isOpen, onClose }) {
  const [step, setStep] = useState(2);
  const [isComplete, setIsComplete] = useState(false);
  const [isArtistSearch, setIsArtistSearch] = useState(false);

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
      {step >= 3 && (
        <div className="close-btn-box">
          <button className="close icon" onClick={onClose}>
            <XIcon />
          </button>
        </div>
      )}

      {step === 2 && (
        <section className="step-2">
          <div className="map">지도 위치</div>

          <div className="container">
            <h2>방문 인증할 장소를 선택해주세요.</h2>

            <ul className="card-list">
              <PlaceCard
                className="selected"
                tag="장소카테고리"
                title="장소명"
                description="주소"
              />
              <PlaceCard tag="장소카테고리" title="장소명" description="주소" />
              <PlaceCard tag="장소카테고리" title="장소명" description="주소" />
            </ul>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="step-3">
          <div className="container">
            <div className="verify-selected">
              <div className="place row">
                <div className="image">
                  <img src="https://picsum.photos/id/156/600/400" alt="" />
                </div>
                <p>송도해수욕장</p>
              </div>
            </div>

            <hr />
            {/* MEMO: artist search는 스텝이 길어져서 components로 빼야함
            현재 작업: 아티스트 이름 검색하여 아티스트 결과 뜨는 거까지 진행 */}
            {isArtistSearch ? (
              <>
                <div className="artist-search">
                  <div className="search-input">
                    <input type="text" placeholder="아티스트로 찾아볼까요?" />
                    <button type="button" className="icon">
                      <MagnifyingGlassIcon />
                    </button>
                  </div>
                </div>

                <div className="artist-search-results">
                  <ul className="artist-list">
                    <li className="artist">
                      <button type="button">
                        <div className="image">
                          <img
                            src="https://picsum.photos/id/1005/200/200"
                            alt=""
                          />
                        </div>
                        <p className="name">최지우</p>
                        <p className="group ellipsis-2">(그룹 있다면)</p>
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <div
                className="artist-search-prompt"
                onClick={() => setIsArtistSearch(true)}
              >
                <p>미디어가 생각 안 난다면,</p>

                <div className="search-shape">
                  <p>아티스트로 찾아볼까요?</p>
                  <span className="icon">
                    <MagnifyingGlassIcon />
                  </span>
                </div>
              </div>
            )}

            {isArtistSearch ? (
              <button
                type="button"
                className="media-selection-toggle"
                onClick={() => setIsArtistSearch(false)}
              >
                <span>방문 인증할 미디어</span>
                <span className="icon">
                  <CaretDownIcon />
                </span>
              </button>
            ) : (
              <div className="media-selection">
                <h2>방문 인증할 미디어를 선택해주세요.</h2>

                <ul className="card-list">
                  <MediaCard className="selected" tag="예능" title="런닝맨" />
                  <MediaCard tag="예능" title="스테이씨, 떴다!" />
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {step === 4 && (
        <section className="step-4">
          <div className="container">
            <div className="verify-selected">
              <div className="place row">
                <div className="image">
                  <img src="https://picsum.photos/id/156/600/400" alt="" />
                </div>
                <p>송도해수욕장</p>
              </div>

              <div className="media row">
                <div className="image">
                  <img src="https://picsum.photos/id/222/600/400" alt="" />
                </div>
                <p>런닝맨</p>
              </div>
            </div>

            <hr />

            <div className="artist-selection">
              <h2>방문 인증할 아티스트를 선택해주세요.</h2>

              <div className="artist-group">
                <div className="group-header">
                  <h3>고정 출연진</h3>

                  <button className="select-all">
                    <span className="icon">
                      <CheckCircleIcon />
                    </span>
                    <span>전체 선택</span>
                  </button>
                </div>

                <ul className="artist-list">
                  <li className="artist">
                    <button>
                      <div className="image">
                        <img
                          src="https://picsum.photos/id/1005/200/200"
                          alt=""
                        />
                      </div>
                      <span className="name">개리</span>
                    </button>
                  </li>

                  <li className="artist selected">
                    <button>
                      <div className="image">
                        <img
                          src="https://picsum.photos/id/1005/200/200"
                          alt=""
                        />
                      </div>
                      <span className="name">김종국</span>
                    </button>
                  </li>

                  <li className="artist">
                    <button>
                      <div className="image">
                        <img
                          src="https://picsum.photos/id/1005/200/200"
                          alt=""
                        />
                      </div>
                      <span className="name">송지효</span>
                    </button>
                  </li>

                  <li className="artist">
                    <button>
                      <div className="image">
                        <img
                          src="https://picsum.photos/id/1005/200/200"
                          alt=""
                        />
                      </div>
                      <span className="name">양세찬</span>
                    </button>
                  </li>
                </ul>
              </div>

              <div className="artist-group">
                <h3>게스트</h3>
                <ul className="artist-list">
                  <li className="artist">
                    <button>
                      <div className="image">
                        <img
                          src="https://picsum.photos/id/1005/200/200"
                          alt=""
                        />
                      </div>
                      <span className="name">최지우</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}
      {step === 5 && (
        <section className="step-5">
          <div className="container">
            <div className="confirmation">
              <div className="selected-list">
                <div className="selected-item">
                  <div className="image">
                    <img src="https://picsum.photos/id/156/600/400" alt="" />
                  </div>
                  <p>송도해수욕장</p>
                </div>

                <div className="selected-item">
                  <div className="image">
                    <img src="https://picsum.photos/id/222/600/400" alt="" />
                  </div>
                  <p>런닝맨</p>
                </div>

                <div className="selected-item">
                  <div className="image">
                    <img src="https://picsum.photos/id/1005/200/200" alt="" />
                  </div>
                  <p>김종국</p>
                </div>
              </div>

              {isComplete ? (
                <div className="complete-message">
                  <h3 className="accent-text">
                    방문 인증 투표가 완료되었습니다.
                  </h3>
                  <p>투표에 참여해주셔서 감사합니다.</p>

                  <div className="recommend-message">
                    <p>방문 인증으로 완성되는 여행 타임라인!</p>
                    <p>지금 확인해볼까요?</p>
                  </div>
                </div>
              ) : (
                <h2>해당 내역으로 방문 인증을 진행할까요?</h2>
              )}
            </div>
          </div>
        </section>
      )}

      <div className="actions">
        {isComplete ? (
          <button className="active" onClick={onClose}>
            닫기
          </button>
        ) : (
          <>
            <button className="neutral" onClick={() => setStep(step - 1)}>
              이전
            </button>

            <button
              className="active"
              onClick={() => {
                if (step === 5) {
                  setIsComplete(true);
                } else {
                  setStep(step + 1);
                }
              }}
            >
              {step === 5 ? "제출" : "다음"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}

export default VerifyModal;
