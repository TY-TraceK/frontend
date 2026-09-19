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
  const [step, setStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);

  const [currentPosition, setCurrentPosition] = useState(null);
  const [isPositionReady, setIsPositionReady] = useState(false);

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

    setStep(1);
    setIsComplete(false);

    setSelectedLocation(null);
    setSelectedContent(null);
    setSelectedArtists([]);

    setRelatedContents([]);

    setIsArtistSearch(false);
    setIsSearchFlow(false);
    setSelectedSearchArtist(null);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (!navigator.geolocation) {
      showErrorNotification('이 브라우저에서는 위치 정보를 사용할 수 없습니다.');
      return;
    }

    setIsPositionReady(false);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const actualPosition = {
          latitude: coords.latitude,
          longitude: coords.longitude,
        };

        try {
          const result = await VerifyService.getVerificationLocationCandidates(actualPosition);
          if (result.isInBusan) {
            setCurrentPosition(actualPosition);
            setLocations([]);
            setIsPositionReady(true);
            setStep(2);
            return;
          }

          setLocations(result.locations ?? []);
          setIsPositionReady(true);
          setStep(2);
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
  }, [isOpen]);


  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    if (location?.latitude != null && location?.longitude != null) {
      setCurrentPosition({
        latitude: location.latitude,
        longitude: location.longitude,
      });
    }
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

  const handleSubmit = async () => {
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
        contentId: selectedContent?.contentId ?? null,
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

  const handleSkipDetails = () => {
    if (!selectedLocation) return;
    setSelectedContent(null);
    setSelectedArtists([]);
    setStep(5);
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

        {step === 1 && (
          <section className="location-loading">
            <div className="location-spinner" />
            <p>현재 위치를 확인하고 있습니다.<br />잠시만 기다려주세요.</p>
          </section>
        )}

        {step === 2 && isPositionReady && (
          <PlaceSelectStep
            locations={locations}
            selectedLocation={selectedLocation}
            selectedPosition={currentPosition}
            onSelectLocation={handleSelectLocation}
            onSkipDetails={handleSkipDetails}
          />
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

        {step !== 1 && <div className="actions">
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
