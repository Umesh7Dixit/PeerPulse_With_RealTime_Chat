import { Box, Container } from "@chakra-ui/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import UpdateProfilePage from "./pages/UpdateProfilePage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import CreatePost from "./components/CreatePost";

// "/:username" is dynamic route

function App() {
  const user = useRecoilValue(userAtom);
  const {pathname} = useLocation();

  console.log(user);

  return (
    // <Container  width={"650px"} >
    <Box position={"relative"} w="full">
      <Container maxW={ pathname==='/' ? "9000" : "620px" }>
        <Header />
        <Routes>
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to="/auth" />}
          />

          <Route
            path="/auth"
            element={!user ? <AuthPage /> : <Navigate to="/" />}
          />
          {/* update profile page */}
          <Route
            path="/update"
            element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
          />

          {/* we need to show CreatePage component in userpage not in home page */}
          <Route
            path="/:username"
            element={
              user ? (
                <>
                  <UserPage />
                  <CreatePost />
                </>
              ) : (
                <UserPage />
              )
            }
          />

          <Route path="/:username/post/:pid" element={<PostPage />} />

          <Route
            path="/chat"
            element={user ? <ChatPage /> : <Navigate to={"/auth"} />}
          />
        </Routes>

        {/* if user present then show logout button */}
        {/* {user && <LogoutButton/>} */}

        {/* {user && <CreatePost/>} */}
      </Container>
    </Box>
  );
}

export default App;
