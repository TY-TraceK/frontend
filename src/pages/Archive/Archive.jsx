import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookmarkSimpleIcon,
  CaretLeftIcon,
  CaretRightIcon,
  DotsThreeVerticalIcon,
  HeartIcon,
  PencilSimpleLineIcon,
} from '@phosphor-icons/react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import './Archive.css';
import { PenIcon, PenLineIcon } from 'lucide-react';

function Archive() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [totalSlides, setTotalSlides] = useState(5);

  return (
    <main className="archive">
      <div className="container">
        <section className="tabs archive">
          <button type="button" className="tab selected">
            아카이브
          </button>

          <button type="button" className="tab">
            {/* MEMO: content list 페이지를 템플릿화할 예정
                      해당 버튼 클릭 시 list 페이지로 이동 북마크 정보 불러오기 */}
            북마크
          </button>

          <button type="button" className="tab">
            {/* MEMO: 클릭 시 contents에서 좋아한 여행지 list 페이지로 이동 */}
            좋아요
          </button>
        </section>

        <section className="archive-filter">
          {/* MEMO: 추후 DatePicker 라이브러리를 적용하여 사용자가 연도/월을 선택할 수 있도록 구현 예정. 선택한 연/월은 아카이브 조회 API와 연결. */}
          <span className="year">2026년</span>
          <span className="month">9월</span>
        </section>

        <section className="archive-list">
          <div className="archive-header">
            <div className="date-location">
              <span className="date">9/1</span>
              {/* MEMO: 여러 지역이 있을 경우. 불가하면 location 삭제 가능 */}
              <span className="location">부산광역시 외 n곳</span>
            </div>

            <span className="count">
              <span className="current accent-text">
                {String(currentSlide).padStart(2, '0')}
              </span>
              <span className="divider">/</span>
              <span className="total">
                {String(totalSlides).padStart(2, '0')}
              </span>
            </span>
          </div>

          <div className="swiper-container">
            <Swiper
              modules={[Navigation]}
              navigation={{
                prevEl: '.prev',
                nextEl: '.next',
              }}
              onInit={(swiper) => {
                setTotalSlides(swiper.slides.length);
              }}
              onSlideChange={(swiper) => {
                setCurrentSlide(swiper.activeIndex + 1);
              }}
            >
              <SwiperSlide>
                <article className="archive-item">
                  <div className="image">
                    <img
                      src="https://picsum.photos/id/833/600/400"
                      alt="장소명"
                    />
                  </div>

                  <div className="actions relative">
                    <div className="left">
                      {/* MEMO: 좋아요와 북마크는 추가되면 weight fill 로 변경 */}
                      <button type="button" className="icon heart">
                        <HeartIcon />
                      </button>

                      <button type="button" className="icon bookmark">
                        <BookmarkSimpleIcon />
                      </button>
                    </div>

                    <div className="right">
                      <button type="button" className="icon edit">
                        <PencilSimpleLineIcon />
                      </button>

                      <button type="button" className="icon more">
                        <DotsThreeVerticalIcon />
                      </button>
                    </div>

                    <div className="delete-menu">
                      <button type="button" className="delete">
                        단일 삭제
                      </button>
                      {/* MEMO: 전체 삭제가 불가할 경우, 해당 버튼 삭제 및 '단일 삭제'를 '해당 인증 삭제'로 변경 바랍니다. */}
                      <button type="button" className="delete-all">
                        전체 삭제
                      </button>
                    </div>
                  </div>

                  <div className="place-info">
                    <div className="title-row">
                      <span className="title">장소명</span>
                      <span className="created-at">hh:mm</span>
                    </div>

                    <p className="description">주소</p>

                    <div className="tags">
                      <Link to="#" className="tag">
                        artist name
                      </Link>

                      <Link to="#" className="tag">
                        media name
                      </Link>
                    </div>
                  </div>
                </article>
              </SwiperSlide>

              <SwiperSlide>
                <article className="archive-item">
                  <div className="image">
                    <img
                      src="https://picsum.photos/id/834/600/400"
                      alt="장소명 2"
                    />
                  </div>
                  <div className="actions">
                    <div className="left">
                      <button type="button" className="icon heart">
                        <HeartIcon />
                      </button>

                      <button type="button" className="icon bookmark">
                        <BookmarkSimpleIcon />
                      </button>
                    </div>

                    <div className="right">
                      <button type="button" className="icon edit">
                        <PencilSimpleLineIcon />
                      </button>

                      <button type="button" className="icon more">
                        <DotsThreeVerticalIcon />
                      </button>
                    </div>

                    <div className="delete-menu">
                      <button type="button">단일 삭제</button>
                      <button type="button">전체 삭제</button>
                    </div>
                  </div>

                  <div className="place-info">
                    <div className="title-row">
                      <span className="title">장소명</span>
                      <span className="created-at">hh:mm</span>
                    </div>

                    <p className="description">주소</p>

                    <div className="tags">
                      <Link to="#" className="tag">
                        artist name
                      </Link>

                      <Link to="#" className="tag">
                        media name
                      </Link>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            </Swiper>

            <button type="button" className="navigation icon prev">
              <CaretLeftIcon />
            </button>

            <button type="button" className="navigation icon next">
              <CaretRightIcon />
            </button>
          </div>
        </section>
      </div>
      <div className="modal-bg">
        <div className="modal-container">
          <div className="modal">
            <p className="title">해당 방문 인증을 수정할까요?</p>

            <div className="description">
              <p>
                <strong>인증 후 24시간 이내</strong>에만
              </p>
              <p>아티스트와 미디어 콘텐츠를 수정할 수 있습니다.</p>
            </div>

            <div className="content">
              <p>MM/DD hh:mm 장소명</p>
              <p>아티스트, 미디어</p>
            </div>

            <div className="buttons">
              <button type="button" className="close">
                닫기
              </button>

              {/* MEMO: 수정 버튼 클릭 시, verifyModal 분리 예정인 아티스트 검색 컴포넌트로 검색 예정 */}
              <button type="button" className="edit active">
                수정
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Archive;
