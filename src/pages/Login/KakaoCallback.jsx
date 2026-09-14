import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '@/api/services/index.js';

function KakaoCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const requestedRef = useRef(false);
  const [loginUser, setLoginUser] = useState(null);

  useEffect(() => {
    if (requestedRef.current) {
      return;
    }

    requestedRef.current = true;

    const login = async () => {
      const code = searchParams.get('code');

      if (!code) {
        navigate('/login', { replace: true });
        return;
      }
      try {
        const data = await authService.loginWithKakao(code);
        setLoginUser(data);
      } catch (error) {
        console.error('카카오 로그인 실패:', error);
      }
    };

    login();
  }, [searchParams, navigate]);

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
        height="full"
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
