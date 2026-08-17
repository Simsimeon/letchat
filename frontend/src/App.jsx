import './App.css'
import { ThemeProvider } from './context/themeContext';
import {Navigate, Route,Routes} from 'react-router';
import ChatPage from './pages/ChatPage';
import AuthPage from './pages/AuthPage';
import {useAuth} from '@clerk/react'
import { WallpaperProvider } from './context/WallpaperContext';
function App() {
  const { isLoaded,isSignedIn}= useAuth()

  if(!isLoaded) return <p>loading....</p>
  return (
    <ThemeProvider>
      <WallpaperProvider>
        <Routes>
          <Route path="/" element={isSignedIn ?<ChatPage/>: <Navigate to={"/auth"} replace/>}/>
          <Route path="/auth" element={!isSignedIn?<AuthPage/>:<Navigate to={"/"} replace/>}/>
        </Routes>
      </WallpaperProvider>
    </ThemeProvider>
    
  )
}
 
export default App