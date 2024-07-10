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

import CreatePost from './components/CreatePost';

// "/:username" is dynamic route


function App() {
  

  const user = useRecoilValue(userAtom);

  console.log(user);


  return (
    // <Container  width={"650px"} >
    <Container maxWidth="container.md">
        <Header/>
      <Routes>

        <Route path="/" element={user ? <HomePage/> : <Navigate to="/auth" /> } />

        <Route path="/auth" element={!user?<AuthPage/>:<Navigate to="/" />} />
        {/* update profile page */}
        <Route path="/update" element={user?<UpdateProfilePage/>:<Navigate to="/auth" />} />
        
{/* we need to show CreatePage component in userpage not in home page */}
        <Route path="/:username" element={ user? (
         <>
           <UserPage/>
           <CreatePost/> 
         </>
         )
          : 
          (
           <UserPage/>
          )  
          }/>


        <Route path="/:username/post/:pid" element={<PostPage/>}/>
      </Routes>

      {/* if user present then show logout button */}
      {user && <LogoutButton/>}

      {/* {user && <CreatePost/>} */}

      

    </Container>
  );
}

export default App
