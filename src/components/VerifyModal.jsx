import { useEffect, useState } from 'react';
import './VerifyModal.css';

import { XIcon } from '@phosphor-icons/react';
import { notification } from 'antd';

import PlaceSelectStep from './steps/PlaceSelectStep';
import ContentSelectStep from './steps/ContentSelectStep';
import ArtistSelectStep from './steps/ArtistSelectStep';
import VerifyConfirmStep from './steps/VerifyConfirmStep';
import VerifyService from '@/api/services/verifyService.js';

const getErrorMessage = (error, fallbackMessage) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    fallbackMessage
  );
};

const showErrorNotification = (description) => {
  notification.error({
    message: '오류가 발생했습니다.',
    description,
    placement: 'topRight',
    duration: 4.5,
  });
};

const showWarningNotification = (description) => {
  notification.warning({
    message: '확인해주세요.',
    description,
    placement: 'topRight',
    duration: 4.5,
  });
};

const showInfoNotification = (description) => {
  notification.info({
    message: '안내',
    description,
    placement: 'topRight',
    duration: 4.5,
  });
};

function VerifyModal({ isOpen, onClose }) {
  const [step, setStep] = useState(2);
  const [isComplete, setIsComplete] = useState(false);

  const [currentPosition, setCurrentPosition] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);
  const [locationPhase, setLocationPhase] = useState('loading');
  const [testLocations, setTestLocations] = useState([]);
  const [selectedTestLocation, setSelectedTestLocation] = useState(null);

  const [locations, setLocations] = useState([]);
  const [relatedContents, setRelatedContents] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedArtists, setSelectedArtists] = useState([]);

  const [isArtistSearch, setIsArtistSearch] = useState(false);
  const [isSearchFlow, setIsSearchFlow] = useState(false);
  const [selectedSearchArtist, setSelectedSearchArtist] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const artists = selectedContent?.artists ?? [];

  const fixedArtists = artists.filter((artist) => artist.isFixed);

  const guestArtists = artists.filter((artist) => !artist.isFixed);

  const searchedArtistContents = selectedSearchArtist
    ? relatedContents.filter((content) =>
        content.artists?.some(
          (artist) => artist.artistId === selectedSearchArtist.id
        )
      )
    : [];

  const isAllFixedSelected =
    fixedArtists.length > 0 &&
    fixedArtists.every((artist) =>
      selectedArtists.some((selected) => selected.artistId === artist.artistId)
    );

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    setStep(2);
    setIsComplete(false);

    setSelectedLocation(null);
    setSelectedContent(null);
    setSelectedArtists([]);

    setRelatedContents([]);

    setIsArtistSearch(false);
    setIsSearchFlow(false);
    setSelectedSearchArtist(null);
    setCurrentPosition(null);
    setMapBounds(null);
    setTestLocations([]);
    setSelectedTestLocation(null);
    setLocationPhase('loading');
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || locationPhase !== 'loading') return;

    if (!navigator.geolocation) {
      showErrorNotification('이 브라우저에서는 위치 정보를 사용할 수 없습니다.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const position = {
          latitude: coords.latitude,
          longitude: coords.longitude,
        };

        try {
          const result = await VerifyService.getVerificationLocationCandidates(position);

          if (result.isInBusan) {
            setCurrentPosition(position);
            setLocationPhase('position');
            return;
          }

          setTestLocations(result.locations ?? []);
          setLocationPhase('test-select');
          showInfoNotification(
            '방문 인증은 부산 지역에서만 가능합니다. 테스트 기간 동안 임의의 부산 GPS를 선택해주세요.'
          );
        } catch (error) {
          showErrorNotification(getErrorMessage(error, '현재 위치 확인에 실패했습니다.'));
        }
      },
      () => showErrorNotification('현재 위치를 가져올 수 없습니다. 위치 권한을 확인해주세요.'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [isOpen, locationPhase]);

  const moveToPlaceSelection = (position) => {
    const latitudeDelta = 0.0009;
    const longitudeDelta = 0.0011;
    setCurrentPosition(position);
    setMapBounds({
      southwestLatitude: position.latitude - latitudeDelta,
      southwestLongitude: position.longitude - longitudeDelta,
      northeastLatitude: position.latitude + latitudeDelta,
      northeastLongitude: position.longitude + longitudeDelta,
    });
    setLocationPhase('ready');
    setStep(2);
  };

  const handleSelectTestPosition = (location) => {
    setSelectedTestLocation(location);
    moveToPlaceSelection({
      latitude: Number(location.latitude),
      longitude: Number(location.longitude),
    });
  };

  const handleConfirmPosition = () => {
    if (!currentPosition) return;
    moveToPlaceSelection(currentPosition);
  };

  useEffect(() => {
    if (!isOpen || locationPhase !== 'ready' || !mapBounds) return;

    const fetchLocations = async () => {
      try {
        setIsLoading(true);
        const result = await VerifyService.getLocationsWithinBounds(mapBounds);
        setLocations(result ?? []);
      } catch (error) {
        console.error('지도 범위 관광지 조회 실패:', error);
        setLocations([]);
        showErrorNotification(getErrorMessage(error, '관광지 조회에 실패했습니다.'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, [isOpen, locationPhase, mapBounds]);


  const handleSelectLocation = (location) => {
    if (!location?.id) {
      showErrorNotification('장소 정보를 불러올 수 없습니다.');
      return;
    }

    setSelectedLocation(location);
    setSelectedContent(null);
    setSelectedArtists([]);
    setRelatedContents([]);

    setIsArtistSearch(false);
    setIsSearchFlow(false);
    setSelectedSearchArtist(null);
  };

  const handleSelectContent = (content) => {
    if (!content?.contentId) {
      showErrorNotification('콘텐츠 정보를 불러올 수 없습니다.');
      return;
    }

    setSelectedContent(content);

    if (!isArtistSearch) {
      setSelectedArtists([]);
    }
  };

  const handleSelectArtist = (artist) => {
    if (!artist?.artistId) {
      showErrorNotification('아티스트 정보를 불러올 수 없습니다.');
      return;
    }

    setSelectedArtists((prev) => {
      const selected = prev.some((item) => item.artistId === artist.artistId);

      if (selected) {
        return prev.filter((item) => item.artistId !== artist.artistId);
      }

      return [...prev, artist];
    });
  };

  const isArtistSelected = (artistId) => {
    return selectedArtists.some((artist) => artist.artistId === artistId);
  };

  const handleSelectAllFixedArtists = () => {
    if (fixedArtists.length === 0) {
      showWarningNotification('선택할 수 있는 고정 출연진이 없습니다.');
      return;
    }

    if (isAllFixedSelected) {
      const fixedIds = new Set(fixedArtists.map((artist) => artist.artistId));

      setSelectedArtists((prev) =>
        prev.filter((artist) => !fixedIds.has(artist.artistId))
      );

      return;
    }

    setSelectedArtists((prev) => {
      const selectedIds = new Set(prev.map((artist) => artist.artistId));

      const artistsToAdd = fixedArtists.filter(
        (artist) => !selectedIds.has(artist.artistId)
      );

      return [...prev, ...artistsToAdd];
    });
  };

  const fetchRelatedInfo = async () => {
    if (!selectedLocation?.id) {
      showWarningNotification('방문 인증할 장소를 선택해주세요.');
      return false;
    }

    try {
      setIsLoading(true);

      const relatedInfo = await VerifyService.getLocationRelatedInfo(
        selectedLocation.id
      );

      const contents = relatedInfo?.relatedContentGroups ?? [];

      setRelatedContents(contents);

      if (contents.length === 0) {
        showInfoNotification('이 장소에 등록된 콘텐츠가 없습니다.');
      }

      return true;
    } catch (error) {
      console.error('관광지 연관 정보 조회 실패:', error);

      setRelatedContents([]);

      showErrorNotification(
        getErrorMessage(error, '연관 콘텐츠 조회에 실패했습니다.')
      );

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenArtistSearch = () => {
    setIsArtistSearch(true);
    setIsSearchFlow(false);

    setSelectedSearchArtist(null);
    setSelectedContent(null);
    setSelectedArtists([]);
  };

  const handleSelectSearchArtist = (artist) => {
    if (!artist?.id) {
      showErrorNotification('아티스트 정보를 불러올 수 없습니다.');
      return;
    }

    setSelectedSearchArtist(artist);
    setSelectedContent(null);
    setSelectedArtists([]);
  };

  const handleResetSelectedSearchArtist = () => {
    setSelectedSearchArtist(null);
    setSelectedContent(null);
    setSelectedArtists([]);
  };

  const handleCloseArtistSearch = () => {
    setIsArtistSearch(false);
    setIsSearchFlow(false);

    setSelectedSearchArtist(null);
    setSelectedContent(null);
    setSelectedArtists([]);
  };

  const createSelectedArtistFromSearch = (artist) => {
    if (!artist?.id) {
      return null;
    }

    return {
      artistId: artist.id,
      artistName: artist.name,
      artistPictureUrl: artist.pictureUrl,
      alias: artist.alias,
    };
  };

  const handleSubmitLocationOnly = async () => {
    if (!selectedLocation?.id) {
      showWarningNotification('방문 인증할 장소를 선택해주세요.');
      return;
    }

    if (
      currentPosition?.latitude == null ||
      currentPosition?.longitude == null
    ) {
      showErrorNotification('현재 위치 정보를 확인할 수 없습니다.');
      return;
    }

    try {
      setIsLoading(true);

      await VerifyService.createVisitVerification({
        locationId: selectedLocation.id,
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
      });

      setIsComplete(true);
    } catch (error) {
      console.error('장소 방문 인증 실패:', error);
      showErrorNotification(
        getErrorMessage(error, '방문 인증에 실패했습니다.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedLocation?.id) {
      showWarningNotification('방문 인증할 장소를 선택해주세요.');
      return;
    }

    if (!selectedContent?.contentId) {
      showWarningNotification('방문 인증할 콘텐츠를 선택해주세요.');
      return;
    }

    if (selectedArtists.length === 0) {
      showWarningNotification('방문 인증할 아티스트를 선택해주세요.');
      return;
    }

    if (
      currentPosition?.latitude == null ||
      currentPosition?.longitude == null
    ) {
      showErrorNotification('현재 위치 정보를 확인할 수 없습니다.');
      return;
    }

    try {
      setIsLoading(true);

      await VerifyService.createVisitVerification({
        locationId: selectedLocation.id,
        contentId: selectedContent.contentId,
        artistIds: selectedArtists.map((artist) => artist.artistId),
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
      });

      setIsComplete(true);
    } catch (error) {
      console.error('방문 인증 실패:', error);

      showErrorNotification(
        getErrorMessage(error, '방문 인증에 실패했습니다.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (step === 2) {
      if (!selectedLocation) {
        showWarningNotification('방문 인증할 장소를 선택해주세요.');
        return;
      }

      const success = await fetchRelatedInfo();

      if (success) {
        setStep(3);
      }

      return;
    }

    if (step === 3) {
      if (!selectedContent) {
        showWarningNotification('방문 인증할 콘텐츠를 선택해주세요.');
        return;
      }

      // 검색 경로
      if (isArtistSearch) {
        if (!selectedSearchArtist) {
          showWarningNotification('아티스트를 선택해주세요.');
          return;
        }

        const artist = createSelectedArtistFromSearch(selectedSearchArtist);

        if (!artist) {
          showErrorNotification('선택한 아티스트 정보가 올바르지 않습니다.');
          return;
        }

        setSelectedArtists([artist]);

        setIsSearchFlow(true);
        setStep(5);

        return;
      }

      setIsSearchFlow(false);
      setStep(4);

      return;
    }

    if (step === 4) {
      if (selectedArtists.length === 0) {
        showWarningNotification('방문 인증할 아티스트를 선택해주세요.');
        return;
      }

      setIsSearchFlow(false);
      setStep(5);

      return;
    }

    if (step === 5) {
      await handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (step === 2) {
      onClose();
      return;
    }

    if (step === 3) {
      if (isArtistSearch) {
        handleCloseArtistSearch();
        return;
      }

      setSelectedContent(null);
      setSelectedArtists([]);
      setStep(2);

      return;
    }

    if (step === 4) {
      setSelectedArtists([]);
      setStep(3);

      return;
    }

    if (step === 5) {
      // 검색 경로
      if (isSearchFlow) {
        setSelectedArtists([]);
        setStep(3);

        return;
      }

      setStep(4);
    }
  };

  const isNextDisabled =
    isLoading ||
    (step === 2 && !selectedLocation) ||
    (step === 3 && !selectedContent) ||
    (step === 4 && selectedArtists.length === 0);

  if (!isOpen) {
    return null;
  }

  return (
    <main className="verify-modal">
      <div className="frame">
        {step >= 3 && (
          <div className="close-btn-box">
            <button type="button" className="close icon" onClick={onClose}>
              <XIcon />
            </button>
          </div>
        )}

        {locationPhase === 'loading' && (
          <section className="location-loading">
            <div className="location-spinner" />
            <p>현재 위치를 확인하고 있습니다.<br />잠시만 기다려주세요.</p>
          </section>
        )}

        {locationPhase === 'test-select' && (
          <PlaceSelectStep
            locations={testLocations}
            selectedLocation={selectedTestLocation}
            onSelectLocation={handleSelectTestPosition}
            title="테스트할 위치를 선택해주세요."
            mapPosition={
              selectedTestLocation
                ? {
                    latitude: Number(selectedTestLocation.latitude),
                    longitude: Number(selectedTestLocation.longitude),
                  }
                : testLocations[0]
                  ? {
                      latitude: Number(testLocations[0].latitude),
                      longitude: Number(testLocations[0].longitude),
                    }
                  : null
            }
            onMapOutOfRange={() =>
              showWarningNotification('100m 안에서만 방문 인증 가능합니다!')
            }
          />
        )}

        {locationPhase === 'position' && currentPosition && (
          <>
          <PlaceSelectStep
            locations={[]}
            selectedLocation={null}
            onSelectLocation={() => {}}
            title="현재 위치를 확인해주세요."
            mapPosition={currentPosition}
            onMapOutOfRange={() =>
              showWarningNotification('100m 안에서만 방문 인증 가능합니다!')
            }
          />
          <div className="position-confirm-wrap">
            <button type="button" className="position-confirm" onClick={handleConfirmPosition}>
              이 위치에서 방문 인증하기
            </button>
          </div>
          </>
        )}

        {locationPhase === 'ready' && step === 2 && (
          <>
          <PlaceSelectStep
            locations={locations}
            selectedLocation={selectedLocation}
            onSelectLocation={handleSelectLocation}
            mapPosition={currentPosition}
            onMapOutOfRange={() =>
              showWarningNotification('100m 안에서만 방문 인증 가능합니다!')
            }
          />
          <div className="location-only-action">
            <button
              type="button"
              className={selectedLocation ? 'active' : 'disabled'}
              disabled={!selectedLocation || isLoading}
              onClick={handleSubmitLocationOnly}
            >
              장소만 선택하고 넘어가기
            </button>
          </div>
          </>
        )}

        {step === 3 && (
          <ContentSelectStep
            selectedLocation={selectedLocation}
            relatedContents={relatedContents}
            selectedContent={selectedContent}
            onSelectContent={handleSelectContent}
            isArtistSearch={isArtistSearch}
            onOpenArtistSearch={handleOpenArtistSearch}
            onCloseArtistSearch={handleCloseArtistSearch}
            selectedSearchArtist={selectedSearchArtist}
            onSelectSearchArtist={handleSelectSearchArtist}
            onResetSelectedSearchArtist={handleResetSelectedSearchArtist}
            searchedArtistContents={searchedArtistContents}
          />
        )}

        {step === 4 && (
          <ArtistSelectStep
            selectedLocation={selectedLocation}
            selectedContent={selectedContent}
            fixedArtists={fixedArtists}
            guestArtists={guestArtists}
            isAllFixedSelected={isAllFixedSelected}
            isArtistSelected={isArtistSelected}
            onSelectArtist={handleSelectArtist}
            onSelectAllFixedArtists={handleSelectAllFixedArtists}
          />
        )}

        {step === 5 && (
          <VerifyConfirmStep
            selectedLocation={selectedLocation}
            selectedContent={selectedContent}
            selectedArtists={selectedArtists}
            isComplete={isComplete}
          />
        )}

        {locationPhase === 'ready' && <div className="actions">
          {isComplete ? (
            <button type="button" className="active" onClick={onClose}>
              닫기
            </button>
          ) : (
            <>
              <button
                type="button"
                className="neutral"
                onClick={handlePrevious}
              >
                이전
              </button>

              <button
                type="button"
                className={isNextDisabled ? 'disabled' : 'active'}
                onClick={handleNext}
                disabled={isNextDisabled}
              >
                {step === 5 ? '제출' : '다음'}
              </button>
            </>
          )}
        </div>}
      </div>
    </main>
  );
}

export default VerifyModal;
