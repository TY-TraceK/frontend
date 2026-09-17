import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '@/api/services/index.js';
import { useProfile } from '@/hooks/userContext.jsx';

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
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <h2>로그인 실패</h2>

        <p>{loginError.message}</p>

        <p>에러 코드: {loginError.code}</p>

        {loginError.status && <p>HTTP 상태 코드: {loginError.status}</p>}

        <button
          type="button"
          onClick={() => navigate('/login', { replace: true })}
          style={{
            padding: '10px 24px',
            cursor: 'pointer',
            border: '1px solid black',
          }}
        >
          다시 로그인
        </button>
      </div>
    );
  }

  if (!loginUser) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        카카오 로그인 처리 중...
      </div>
    );
  }

  return (
    <div
      style={{
        textAlign: 'center',
        marginTop: '100px',
        alignItems: 'center',
      }}
    >
      <h2>로그인 성공!</h2>

      <img
        src={loginUser.profileImageUrl}
        alt="프로필"
        width="200"
        height="200"
        style={{
          borderRadius: '50%',
          objectFit: 'cover',
          border: '1px solid black',
        }}
      />

      <h3>{loginUser.nickName}</h3>

      <p>
        {loginUser.isNewUser
          ? '회원가입이 완료되었습니다.'
          : '로그인되었습니다.'}
      </p>

      <button
        type="button"
        onClick={() => navigate('/', { replace: true })}
        style={{
          padding: '10px 24px',
          cursor: 'pointer',
          border: '1px solid black',
        }}
      >
        확인
      </button>
    </div>
  );
}

export default KakaoCallback;
