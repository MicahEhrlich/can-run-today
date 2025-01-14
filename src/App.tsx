import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Wizard } from './components/Register/Wizard'
import SignIn from './components/SignIn/SignIn';
import AuthenticatedRoute from './routing/AuthenticatedRoute';
import Dashboard from './components/Dashboard/Dashboard';
import Settings from './components/Settings/Settings';
import PageNotFound from './components/SignIn/PageNotFound';
import Social from './components/Social/Social';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<Wizard />} />
        <Route element={<AuthenticatedRoute />} >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path='/social' element={<Social />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  )
}

export default App
