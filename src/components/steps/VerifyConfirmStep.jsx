function VerifyConfirmStep({
  selectedLocation,
  selectedContent,
  selectedArtists,
  isComplete,
}) {
  const representativeArtist = selectedArtists[0];

  return (
    <section className="step-5">
      <div className="container">
        <div className="confirmation">
          <div className="selected-list">
            <div className="selected-item">
              <div className="image">
                <img
                  src={selectedLocation?.mainImageUrl}
                  alt={selectedLocation?.name ?? ''}
                />
              </div>

              <p>{selectedLocation?.name}</p>
            </div>

            {selectedContent && <div className="selected-item">
              <div className="image">
                <img
                  src={selectedContent?.contentPictureUrl}
                  alt={selectedContent?.contentTitle ?? ''}
                />
              </div>

              <p>{selectedContent?.contentTitle}</p>
            </div>}

            {representativeArtist && <div className="selected-item">
              <div className="image">
                <img
                  src={representativeArtist?.artistPictureUrl}
                  alt={representativeArtist?.artistName ?? ''}
                />
              </div>

              <p>
                {representativeArtist?.artistName}

                {selectedArtists.length > 1 &&
                  ` 외 ${selectedArtists.length - 1}명`}
              </p>
            </div>}
          </div>

          {isComplete ? (
            <div className="complete-message">
              <h3 className="accent-text">방문 인증 투표가 완료되었습니다.</h3>

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
  );
}

export default VerifyConfirmStep;
