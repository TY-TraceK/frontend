import './Login.css';
import logo from '../../assets/img/logo.png';

function Login() {
  const loginWithKakao = () => {
    if (!Kakao.isInitialized()) {
      console.error('Kakao SDK가 초기화되지 않았습니다.');
      return;
    }

    Kakao.Auth.authorize({
      redirectUri: `${location.origin}/auth/kakao/callback`,
      throughTalk: false,
    });
  };

  return (
    <main className="login">
      <div className="container">
        <section className="logo">
          <div className="image">
            <img src={logo} alt="KRoute 로고" />
          </div>
          <p className="slogun">즐겨 보던 화면 속으로,</p>
          <p className="slogun">
            <span className="accent-text">KRoute</span>와 함께 여행을
            떠나보세요!
          </p>
        </section>
        <section className="login-section">
          <button
            className="kakao-login"
            onClick={loginWithKakao}
            type="button"
          >
            <img
              src="https://k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg"
              alt="카카오 로그인"
              width="222"
            />
            {/* <div className="image symbol">
              <img
                src="https://k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg"
                alt="카카오 로그인"
                width="222"
              />
            </div>
            <p className="text">카카오 로그인</p> */}
          </button>
          <p className="description">
            카카오 계정으로 회원가입 및 로그인 할 수 있습니다.
          </p>
        </section>
      </div>
    </main>
  );
}

export default Login;
