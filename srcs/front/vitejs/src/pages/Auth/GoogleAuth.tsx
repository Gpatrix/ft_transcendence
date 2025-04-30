import { useCookies } from "react-cookie";

const GoogleAuth: React.FC = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['state']);

  function fetchOauth() {
    const stateValue = Math.random().toString(36).substring(2, 15);
    
    setCookie('state', stateValue, {
      path: '/', 
      secure: window.location.protocol === 'https:', 
      sameSite: 'lax',
      httpOnly: false,
    });

    const params = new URLSearchParams({
      client_id: '126523871891-i2jnhvg2mgo847mbbkpmio7nj4ikepdp.apps.googleusercontent.com',
      redirect_uri: 'https://localhost/api/auth/login/google/callback',
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
      include_granted_scopes: 'true',
      state: stateValue,
    });

    window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?' + params.toString();
  }

  return (
    <button onClick={fetchOauth}>Test</button>
  );
};

export default GoogleAuth;
