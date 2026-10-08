import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserRegister from "./pages/UserRegister"
import UserLogin from './pages/UserLogin'
import AdminLogin from './pages/AdminLogin'
import NewsPage from './pages/NewsPage'
import Report from './pages/Report'
import About from './pages/About'
import AdminPage from './pages/AdminPage'
import ReportDetails from './pages/ReportDetails'
import UserDetails from './pages/UserDetails'
import Political from './pages/Political'
import Sports from './pages/Sports'
import Science from './pages/Science'
import Technology from './pages/Technology'
import Social from './pages/Social'
import FindByLocation from './pages/FindByLocation'
import ReadMore from './pages/ReadMore'
import Highlights from './pages/Highlights'
import DeleteHighlight from './pages/DeleteHighlight'
import DeleteNews from './pages/DeleteNews'
import EditNews from './pages/EditNews'
import LandingPage from './pages/LandingPage'
function App() {
  const [count, setCount] = useState(0)

  return (
  <BrowserRouter>
  <Routes>
    <Route path='/userregister' element={<UserRegister/>}/>
 <Route path='/' element={<UserLogin/>}/>
  <Route path='/adminlogin' element={<AdminLogin/>}/>
    <Route path='/news' element={<NewsPage/>}/>
    <Route path='/report' element={<Report/>}/>
    <Route path='/about' element={<About/>}/>
    <Route path='/admin' element={<AdminPage/>}/>
    <Route path='/reportdetail' element={<ReportDetails/>}/>
     <Route path='/userdetail' element={<UserDetails/>}/>
     <Route path='/political' element={<Political/>} />
     <Route path='/sports' element={<Sports/>}/>
     <Route path='/science' element={<Science/>}/>
  <   Route path='/tech' element={<Technology/>}/>
  <Route path='/social' element={<Social/>}/>
  <Route path='/find' element={<FindByLocation/>}/>
   <Route path ='readmore' element={<ReadMore/>}/>
 <Route path='/highlightupload' element={<Highlights/>}/>
  <Route path='/deletehighlight' element={<DeleteHighlight/>}/>
   <Route path='/deletenews' element={<DeleteNews/>}/>
   <Route path='/edit' element={<EditNews/>}/>
   <Route path='/landing' element={<LandingPage/>}/>
  </Routes>
  
  </BrowserRouter>
  )
}

export default App
