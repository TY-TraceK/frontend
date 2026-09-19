import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '@/api/services/index.js';
import { useProfile } from '@/hooks/userContext.jsx';
import Logo from '../../assets/img/logo.png';
import './Login.css';

function KakaoCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const requestedRef = useRef(false);

  const [loginUser, setLoginUser] = useState(null);
  const [loginError, setLoginError] = useState(null);

  const { setProfileData } = useProfile();

  useEffect(() => {
    if (requestedRef.current) {
      return;
    }

    requestedRef.current = true;

    const login = async () => {
      const code = searchParams.get('code');

      if (!code) {
        setLoginError({
          code: 'OAUTH_CODE_MISSING',
          message: '카카오 인증 코드가 없습니다.',
        });
        return;
      }

      try {
        const data = await authService.loginWithKakao(code);
        setLoginUser(data);
        setProfileData();
      } catch (error) {
        console.error('카카오 로그인 실패:', error);

        const response = error.response;

        setLoginError({
          status: response?.status,
          code: response?.data?.code ?? error.code ?? 'UNKNOWN_ERROR',
          message:
            response?.data?.message ??
            error.message ??
            '로그인 중 오류가 발생했습니다.',
        });
      }
    };

    login();
  }, [searchParams]);

  if (loginError) {
    return (
      <main className="callback error">
        <h2>로그인 실패</h2>

        <p>{loginError.message}</p>
        <p>에러 코드: {loginError.code}</p>

        {loginError.status && <p>HTTP 상태 코드: {loginError.status}</p>}

        <button
          type="button"
          onClick={() => navigate('/login', { replace: true })}
        >
          다시 로그인
        </button>
      </main>
    );
  }

  if (!loginUser) {
    return <main className="callback loading">카카오 로그인 처리 중...</main>;
  }

  return (
    <main className="callback success">
      <div className="image logo">
        <img src={Logo} alt="KRoute 로고" />
      </div>
      <h2>
        {loginUser.isNewUser
          ? '회원가입이 완료되었습니다.'
          : '로그인되었습니다.'}
      </h2>

      <section className="profile">
        <div className="image">
          <img src={loginUser.profileImageUrl} alt="프로필" />
        </div>
        <h3>{loginUser.nickName}</h3>
      </section>
      <p className="emphasis">KRoute와 함께 여행지를 찾아볼까요?</p>

      <button
        className="active"
        type="button"
        onClick={() => navigate('/', { replace: true })}
      >
        확인
      </button>
    </main>
  );
}

export default KakaoCallback;
