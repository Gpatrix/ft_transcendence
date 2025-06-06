import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Router } from "react-router";
import './css/global.css'

import { AuthProvider } from './AuthProvider.tsx';
import  Login from "./pages/Auth/Login.tsx"
import Register from './pages/Auth/Register.tsx';
import ForgottenPassword from './pages/Auth/ForgottenPassword.tsx';
import  AuthLayout from "./pages/Auth/AuthLayout.tsx"
import { CookiesProvider } from 'react-cookie';
import NewPassword from './pages/Auth/NewPassword.tsx';
import DfaCheck from './pages/Auth/DfaCheck.tsx';
import DfaSetup from './pages/Auth/DfaSetup.tsx';

import ProfileBackground from './pages/Profile/ProfileBackground.tsx';
import MyProfile from './pages/Profile/me/MyProfile.tsx';
import OthersProfile from './pages/Profile/others/OthersProfile.tsx';
import  ChatPage from "./pages/Chat/ChatPage.tsx"
import NotFound from './pages/404/NotFound.tsx';
import Menu from './pages/Lobby/Menu.tsx';
import LobbyLayout from './pages/Lobby/LobbyLayout.tsx';
import FriendsLobby from './pages/Lobby/FriendsLobby/FriendsLobby.tsx';
import PopupCreate from './pages/Lobby/FriendsLobby/PopupCreate.tsx';
import LocalGame from './pages/Game/Local/LocalGame.tsx';
import GameLayout from './pages/Game/GameLayout.tsx';
import LocalGameWrapper from './pages/Game/Local/LocalGameWrapper.tsx';
import MatchMaking from './pages/Lobby/MatchMaking.tsx';
import Multi from './pages/Game/Multiplayer/Multi.tsx';
import AskPlayers from './pages/Tournament/AskPlayers.tsx';
import CreateTournament from './pages/Tournament/CreateTournament.tsx';
import Overview from './pages/Tournament/Overview/Overview.tsx';
import PageFriendLoby from './pages/Lobby/FriendsLobby/PageFriendLoby.tsx';
import LocalTournamentHistory from './pages/Profile/LocalTournamentResults.tsx';

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <CookiesProvider>
        <AuthProvider>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgottenPassword />} />
              <Route path="/forgot-password/new-password" element={<NewPassword />} />
              <Route path="*" element={<NotFound />}/> 
              <Route path='2fa-setup' element={<DfaSetup />}/>
              <Route path='2fa-check' element={<DfaCheck />}/>
              <Route path='/' element={<Menu />} />

            </Route>


            <Route element={<ProfileBackground/>}>
              <Route path="/profile" element={<MyProfile />}/>
              <Route path="/profile/:id" element={<OthersProfile />}/>
              <Route path="/profile/tournament" element={<LocalTournamentHistory />}/>
            </Route>

            <Route element={<LobbyLayout />}>
              <Route path="/lobby/friends" element={<FriendsLobby />}/>
              <Route path="/lobby/friends/create" element={<PopupCreate />}/>
              <Route path="/lobby/matchmaking" element={<MatchMaking/>}/>
              <Route path="/lobby/friendLoby" element={<PageFriendLoby />}/>

            </Route>


            <Route element={<GameLayout />}>
              <Route path="/play/local" element={<LocalGameWrapper/>}/>
              <Route path="/play/multi" element={<Multi/>}/>
              <Route path="/play/tournament" element={<AskPlayers/>}/>
              <Route path="/play/tournament/create" element={<CreateTournament/>}/>
              <Route path="/play/tournament/overview" element={<Overview/>}/>
            </Route>



            <Route path="/chat" element={<ChatPage />} />
            {/* <Route path="/test" element={<App />} /> */}

          </Routes>
        </AuthProvider>
        </CookiesProvider>
    </BrowserRouter>
)
