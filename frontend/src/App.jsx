import { Container } from '@chakra-ui/react'
import { Navigate, Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from './pages/PostPage';
import UpdateProfilePage from './pages/UpdateProfilePage.jsx';

import Header from './components/Header';

import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import { useRecoilValue } from 'recoil';
import userAtom from './atoms/userAtom';
import LogoutButton from './components/LogoutButton';

// "/:username" is dynamic route


function App() {
  

  const user = useRecoilValue(userAtom);

  console.log(user);


  return (
    <Container  width={"650px"} >
        <Header/>
      <Routes>

        <Route path="/" element={user ? <HomePage/> : <Navigate to="/auth" /> } />

        <Route path="/auth" element={!user?<AuthPage/>:<Navigate to="/" />} />
        {/* update profile page */}
        <Route path="/update" element={user?<UpdateProfilePage/>:<Navigate to="/auth" />} />
        

        <Route path="/:username" element={<UserPage/>}/>
        <Route path="/:username/post/:pid" element={<PostPage/>}/>
      </Routes>

      {/* if user present then show logout button */}
      {user && <LogoutButton/>}

    </Container>
  );
}

export default App
