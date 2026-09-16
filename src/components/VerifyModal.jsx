import { useEffect, useState } from 'react';
import './VerifyModal.css';

import { XIcon } from '@phosphor-icons/react';
import { notification } from 'antd';

import {
  createVisitVerification,
  getLocationRelatedInfo,
  getLocationsWithinBounds,
  searchArtists,
} from '@/api/services/verifyService';

import PlaceSelectStep from './steps/PlaceSelectStep';
import ContentSelectStep from './steps/ContentSelectStep';
import ArtistSelectStep from './steps/ArtistSelectStep';
import VerifyConfirmStep from './steps/VerifyConfirmStep';

const TEMP_CURRENT_POSITION = {
  latitude: 35.1796,
  longitude: 129.0756,
};

const TEMP_MAP_BOUNDS = {
  southwestLatitude: 35.101,
  southwestLongitude: 129.001,
  northeastLatitude: 35.11,
  northeastLongitude: 129.01,
};

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

  const [currentPosition] = useState(TEMP_CURRENT_POSITION);
  const [mapBounds] = useState(TEMP_MAP_BOUNDS);

  const [locations, setLocations] = useState([]);
  const [relatedContents, setRelatedContents] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedArtists, setSelectedArtists] = useState([]);

  const [isArtistSearch, setIsArtistSearch] = useState(false);
  const [isSearchFlow, setIsSearchFlow] = useState(false);
  const [selectedSearchArtist, setSelectedSearchArtist] = useState(null);

  const [artistKeyword, setArtistKeyword] = useState('');
  const [artistSearchResults, setArtistSearchResults] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isArtistSearchLoading, setIsArtistSearchLoading] = useState(false);

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

    setArtistKeyword('');
    setArtistSearchResults([]);

    setIsArtistSearchLoading(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchLocations = async () => {
      try {
        setIsLoading(true);

        const result = await getLocationsWithinBounds(mapBounds);

        setLocations(result ?? []);
      } catch (error) {
        console.error('지도 범위 관광지 조회 실패:', error);

        setLocations([]);

        showErrorNotification(
          getErrorMessage(error, '관광지 조회에 실패했습니다.')
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, [isOpen, mapBounds]);

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

    setArtistKeyword('');
    setArtistSearchResults([]);
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

      const relatedInfo = await getLocationRelatedInfo(selectedLocation.id);

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

    setArtistKeyword('');
    setArtistSearchResults([]);

    setSelectedSearchArtist(null);
    setSelectedContent(null);
    setSelectedArtists([]);
  };

  const handleSearchArtist = async () => {
    const keyword = artistKeyword.trim();

    if (!keyword) {
      setArtistSearchResults([]);
      setSelectedSearchArtist(null);

      showWarningNotification('검색할 아티스트 이름을 입력해주세요.');

      return;
    }

    try {
      setIsArtistSearchLoading(true);

      const result = await searchArtists({
        keyword,
        size: 20,
      });

      const searchedArtists = result?.artists ?? [];

      setArtistSearchResults(searchedArtists);

      setSelectedSearchArtist(null);
      setSelectedContent(null);
      setSelectedArtists([]);

      if (searchedArtists.length === 0) {
        showInfoNotification('검색된 아티스트가 없습니다.');
      }
    } catch (error) {
      console.error('아티스트 검색 실패:', error);

      setArtistSearchResults([]);

      showErrorNotification(
        getErrorMessage(error, '아티스트 검색에 실패했습니다.')
      );
    } finally {
      setIsArtistSearchLoading(false);
    }
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

  const handleArtistKeywordChange = (keyword) => {
    setArtistKeyword(keyword);

    if (selectedSearchArtist) {
      setSelectedSearchArtist(null);
      setSelectedContent(null);
      setSelectedArtists([]);
    }
  };

  const handleCloseArtistSearch = () => {
    setIsArtistSearch(false);
    setIsSearchFlow(false);

    setArtistKeyword('');
    setArtistSearchResults([]);

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

      await createVisitVerification({
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
    isArtistSearchLoading ||
    (step === 2 && !selectedLocation) ||
    (step === 3 && !selectedContent) ||
    (step === 4 && selectedArtists.length === 0);

  if (!isOpen) {
    return null;
  }

  return (
    <main className="verify-modal">
      {step >= 3 && (
        <div className="close-btn-box">
          <button type="button" className="close icon" onClick={onClose}>
            <XIcon />
          </button>
        </div>
      )}

      {step === 2 && (
        <PlaceSelectStep
          locations={locations}
          selectedLocation={selectedLocation}
          onSelectLocation={handleSelectLocation}
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
          artistKeyword={artistKeyword}
          onArtistKeywordChange={handleArtistKeywordChange}
          artistSearchResults={artistSearchResults}
          isArtistSearchLoading={isArtistSearchLoading}
          onSearchArtist={handleSearchArtist}
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

      <div className="actions">
        {isComplete ? (
          <button type="button" className="active" onClick={onClose}>
            닫기
          </button>
        ) : (
          <>
            <button type="button" className="neutral" onClick={handlePrevious}>
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
      </div>
    </main>
  );
}

export default VerifyModal;
