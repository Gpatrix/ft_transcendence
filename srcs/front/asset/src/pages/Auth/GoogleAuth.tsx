import { useCookies } from "react-cookie";
import { gpt } from "../../translations/pages_reponses";
import Button from "../../components/Button";

const GoogleAuth: React.FC = () => {
  const [cookies, setCookie] = useCookies(['state']);

  function fetchOauth() {
    void cookies
    const stateValue = Math.random().toString(36).substring(2, 15);
    
    setCookie('state', stateValue, {
      path: '/', 
      secure: window.location.protocol === 'https:', 
      sameSite: 'lax',
      httpOnly: false,
    });

    if (!import.meta.env.VITE_HOST || !import.meta.env.VITE_PORT) {
      return;
    }

    

    const params = new URLSearchParams({
      client_id: '655477694884-4k2r9k84cf4h3hpdf8060kem31irtv4l.apps.googleusercontent.com',
      redirect_uri: `https://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT}/api/auth/login/google/callback`,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
      include_granted_scopes: 'true',
      state: stateValue,
    });

    window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?' + params.toString();
  }

  return (
    <Button onClick={fetchOauth} type="google" className="flex items-center justify-left px-0">
      {gpt("login_google")}
      <img className="h-[25px] ml-10" src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,05000500ffffffff-rw" />
    </Button>
  );
};

export default GoogleAuth;
