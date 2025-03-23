
import './App.css'
import { Button } from './components/ui/button'
import { Routes, Route } from 'react-router-dom'
// import  home from './pages/home'
import Login  from './pages/Login'
import SignupPage from './pages/SignupPage'
import  Home  from './pages/HomePg'
import { useUser } from "./contextApi/UserContext"
import { Navigate } from 'react-router-dom'
import { Toaster } from "@/components/ui/toaster";
// import {UserProvider} from './'

function App() {
    const { user } = useUser();
      const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  };
  return (
    <>
      
       <Routes>
        <Route path='/signup' Component={SignupPage}/>
        <Route path='/login' Component={Login}/>
         <Route path='/' Component={Home}/>
  
          </Routes>
          <Toaster/>
           {/* //  By placing the global <Toaster /> in the App, toast messages remain visible all 
           // other componet where we use the useToast , it will toast the msg in which page i am currently present */}
    </>
  )
}

export default App
