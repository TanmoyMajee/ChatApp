
import './App.css'
import { Button } from './components/ui/button'
import { Routes, Route } from 'react-router-dom'
// import  home from './pages/home'
import Login  from './pages/Login'
import SignupPage from './pages/SignupPage'
import  Home  from './pages/HomePg'
import { useUser } from "./contextApi/UserContext"
import { Navigate } from 'react-router-dom'
// import {UserProvider} from './'

function App() {
    const { user } = useUser();
      const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  };
  // const [count, setCount] = useState(0)
  return (
    <>
      
       <Routes>
        <Route path='/' Component={SignupPage}/>
        <Route path='/login' Component={Login}/>
         <Route path='/home' Component={Home}/>
          {/* <Route
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          /> */}
          </Routes>
    </>
  )
}

export default App
