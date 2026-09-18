import {
  BookmarkSimpleIcon,
  CaretRightIcon,
  CheckIcon,
  HeartIcon,
  MapPinSimpleAreaIcon,
  PencilSimpleLineIcon,
  StarIcon,
  XIcon,
} from '@phosphor-icons/react';
import './Profile.css';
import { Link } from 'react-router-dom';
import { useProfile } from '@/hooks/userContext.jsx';
import { useEffect, useRef, useState } from 'react';
import UserService from '@/api/services/userService.js';
import VerifyService from '@/api/services/verifyService.js';
import RecentLocationStorage from '@/api/recentLocationStorage.js';

function Profile() {
  const { user, setProfileData } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [nickName, setNickName] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [userActivity, setUserActivity] = useState(null);
  const [lastVerificationData, setLastVerificationData] = useState(null);
  const [recentLocations, setRecentLocations] = useState([]);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const isLoggedIn = !!localStorage.getItem('accessToken');

    const fetchData = async () => {
      try {
        if (isLoggedIn && user == null) {
          await setProfileData();
        }
        setUserActivity(await UserService.getUserActivityProjection());
        const verificationData =
          await VerifyService.getMyVisitVerificationHistories({ size: 1 });
        if (
          verificationData?.histories != null &&
          verificationData?.histories.length > 0
        )
          setLastVerificationData(verificationData?.histories[0].items[0]);
      } catch (error) {
        console.error('프로필 조회 실패:', error);
      }
    };
    setRecentLocations(RecentLocationStorage.getRecent(4));
    fetchData();
  }, [user, setProfileData]);

  useEffect(() => {
    if (!user) return;

    setNickName(user.nickName ?? '');
    setPreviewUrl(user.profileUrl ?? null);
  }, [user]);

  // 컴포넌트가 사라질 때 생성한 blob URL 정리
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const startEditing = () => {
    setNickName(user?.nickName ?? '');
    setProfileImage(null);
    setPreviewUrl(user?.profileUrl ?? null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    if (previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    setNickName(user?.nickName ?? '');
    setProfileImage(null);
    setPreviewUrl(user?.profileUrl ?? null);
    setIsEditing(false);
  };

  const handleImageClick = () => {
    if (!isEditing) return;

    fileInputRef.current?.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 선택할 수 있습니다.');
      event.target.value = '';
      return;
    }

    if (previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    setProfileImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const updateProfile = async () => {
    try {
      setIsSaving(true);

      const formData = new FormData();
      if (nickName) {
        formData.append('nickName', nickName.trim());
      }

      if (profileImage) {
        formData.append('imageSource', profileImage);
      }

      await UserService.updateUserProfileData(formData);

      // 서버에 저장된 최신 프로필 다시 조회
      await setProfileData();

      setProfileImage(null);
      setIsEditing(false);
    } catch (error) {
      console.error('프로필 수정 실패:', error);
      alert(error.message || '프로필 수정에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // user가 아직 조회되지 않은 첫 렌더링 방어
  if (!user) {
    return (
      <main className="profile">
        <div className="container">
          <p>프로필을 불러오는 중입니다.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="profile">
      <div className="container">
        <section className="user-info">
          <div
            className={`image ${isEditing ? 'editable' : ''}`}
            onClick={handleImageClick}
          >
            <img src={previewUrl} alt="프로필 이미지" />

            {isEditing && (
              <div className="image-edit-overlay">
                <PencilSimpleLineIcon />
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </div>

          {isEditing ? (
            <input
              className="nickname-input"
              type="text"
              value={nickName}
              onChange={(event) => setNickName(event.target.value)}
              maxLength={20}
              autoFocus
            />
          ) : (
            <h2>{user.nickName}</h2>
          )}

          {isEditing ? (
            <div className="profile-edit-actions">
              <button
                type="button"
                className="icon profile-edit"
                onClick={updateProfile}
                disabled={isSaving}
                aria-label="프로필 저장"
              >
                <CheckIcon />
              </button>

              <button
                type="button"
                className="icon profile-edit"
                onClick={cancelEditing}
                disabled={isSaving}
                aria-label="수정 취소"
              >
                <XIcon />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="icon profile-edit"
              onClick={startEditing}
              aria-label="프로필 수정"
            >
              <PencilSimpleLineIcon />
            </button>
          )}
        </section>

        <section className="recent-place">
          <div className="title-row">
            <h3 className="title">최근 본 여행지</h3>

            <Link to="#" className="accent-text">
              더보기
              <span className="icon">
                <CaretRightIcon />
              </span>
            </Link>
          </div>

          <ul className="list">
            {recentLocations.map((location) => (
              <li className="item" key={location.id}>
                <Link to={`/place?id=${location.id}`}>
                  <div className="image">
                    {location.mainImageUrl && (
                      <img src={location.mainImageUrl} alt={location.name} />
                    )}
                  </div>
                  <span className="location">{location.city}</span>
                  <p className="name ellipsis-1">{location.name}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="statistics">
          <div className="fan-stat stat-box">
            <span className="icon star">
              <StarIcon weight="fill" />
            </span>
            <p className="number">{userActivity?.fanCount}</p>
            <p className="description">아티스트 & 미디어</p>
          </div>
          <div className="verify-stat stat-box">
            <span className="icon accent-text">
              <MapPinSimpleAreaIcon weight="fill" />
            </span>
            <p className="number">{userActivity?.visitVerificationCount}</p>
            <p className="description">방문 인증한 장소</p>
          </div>
          <div className="haert-stat stat-box">
            <span className="icon heart">
              <HeartIcon weight="fill" />
            </span>
            <p className="number">{userActivity?.likedCount}</p>
            <p className="description">좋아한 장소</p>
          </div>
          <div className="bookmark-stat stat-box">
            <span className="icon bookmark">
              <BookmarkSimpleIcon weight="fill" />
            </span>
            <p className="number">{userActivity?.bookMarkCount}</p>
            <p className="description">북마크한 장소</p>
          </div>
        </section>

        <section className="recent-verify-place">
          <h3>최근 방문 인증</h3>
          {lastVerificationData == null ? (
            <div>방문 인증 내역이 없습니다.</div>
          ) : (
            <div className="verify">
              <div className="image">
                <img src={lastVerificationData.locationImageUrl} alt="" />
              </div>

              <div className="info">
                <span className="tag">{lastVerificationData.city}</span>
                <h4>{lastVerificationData.locationName}</h4>
                <p className="verify-content">
                  <span className="artist">
                    {lastVerificationData.artists[0].artistName}
                    {lastVerificationData?.artists?.length > 1 &&
                      `외 ${lastVerificationData?.artists?.length - 1} 명`}
                  </span>
                  <span className="media">
                    {lastVerificationData.contentTitle}
                  </span>
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Profile;
