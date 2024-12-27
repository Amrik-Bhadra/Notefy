import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';

import Home from '../src/pages/Home/Home'
import Login from '../src/pages/Login/Login'
import SignUp from '../src/pages/SignUp/SignUp'
import VerifyOtp from './pages/Forms/VerifyOtp';

const routes = (
  <Router>
    <Routes>
      <Route path='/' exact element={<Home/>}/>
      <Route path='/login' exact element={<Login/>}/>
      <Route path='/signup' exact element={<SignUp/>}/>
      <Route path='/verifyOtp' exact element={<VerifyOtp/>}/>
    </Routes>
  </Router>
);

const App = () => {
  return (
    <div>
      <Toaster position='top-center' />
      {routes}
    </div>
  )
}

export default App