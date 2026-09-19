function VerifyConfirmStep({
  selectedLocation,
  selectedContent,
  selectedArtists,
  isComplete,
}) {
  const representativeArtist = selectedArtists[0];
  const selectedItems = [
    selectedLocation && {
      imageUrl: selectedLocation.mainImageUrl ?? selectedLocation.imageUrl,
      name: selectedLocation.name,
    },
    selectedContent && {
      imageUrl: selectedContent.contentPictureUrl,
      name: selectedContent.contentTitle,
    },
    representativeArtist && {
      imageUrl: representativeArtist.artistPictureUrl,
      name:
        representativeArtist.artistName +
        (selectedArtists.length > 1 ? ` 외 ${selectedArtists.length - 1}명` : ''),
    },
  ].filter(Boolean);

  return (
    <section className="step-5">
      <div className="container">
        <div className="confirmation">
          <div className="selected-list">
            {selectedItems.map((item) => (
              <div className="selected-item" key={item.name}>
                <div className="image">
                  {item.imageUrl && <img src={item.imageUrl} alt={item.name} />}
                </div>
                <p>{item.name}</p>
              </div>
            ))}
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
