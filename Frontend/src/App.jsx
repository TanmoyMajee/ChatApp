
import './App.css'
import { Button } from './components/ui/button'
import { Routes, Route } from 'react-router-dom'
// import  home from './pages/home'
import Login  from './pages/Login'
import SignupPage from './pages/SignupPage'
import  Home  from './pages/HomePg'
// import {UserProvider} from './'

function App() {
  // const [count, setCount] = useState(0)
  return (
    <>
      
       <Routes>
        <Route path='/' Component={SignupPage}/>
        <Route path='/login' Component={Login}/>
         <Route path='/home' Component={Home}/>
          </Routes>
    </>
  )
}

export default App
