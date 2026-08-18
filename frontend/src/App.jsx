import './App.css'
import { ThemeProvider } from './context/themeContext';
import {Navigate, Route,Routes} from 'react-router';
import ChatPage from './pages/ChatPage';
import AuthPage from './pages/AuthPage';
import {useAuth} from '@clerk/react'
import { WallpaperProvider } from './context/WallpaperContext';
import PageLoader from './component/PageLoader';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import {Toaster} from "react-hot-toast";
function App() {
  const { isLoaded,isSignedIn}= useAuth()
   const {clearAuth,isCheckingAuth,checkAuth}=  useAuthStore();
   useEffect(()=>{
    if(!isLoaded) return
    if(isSignedIn)checkAuth();
    else clearAuth();
   })
  if(!isLoaded || (isSignedIn && isCheckingAuth)) return <PageLoader/>
  return (
    <ThemeProvider>
      <WallpaperProvider>
        <Routes>
          <Route path="/" element={isSignedIn ?<ChatPage/>: <Navigate to={"/auth"} replace/>}/>
          <Route path="/auth" element={!isSignedIn?<AuthPage/>:<Navigate to={"/"} replace/>}/>
        </Routes>
        <Toaster/>
      </WallpaperProvider>
    </ThemeProvider>
    
  )
}
 
export default App