function Login() {
  const loginWithKakao = () => {
    if (!Kakao.isInitialized()) {
      console.error("Kakao SDK가 초기화되지 않았습니다.");
      return;
    }

    Kakao.Auth.authorize({
      redirectUri: `${location.origin}/auth/kakao/callback`,
      throughTalk: false,
    });
  };

  return (
      <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            justifyContent: "center",
            alignItems: "center",
          }}
      >
        <button
            type="button"
            onClick={loginWithKakao}
            style={{
              border: "none",
              background: "none",
              padding: 0,
              cursor: "pointer",
            }}
        >
          <img
              src="https://k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg"
              alt="카카오 로그인"
              width="222"
          />
        </button>
      </div>
  );
}

export default Login;