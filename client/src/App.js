import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import CardsDetails from './components/CardsDetails';
import Cards from './components/Cards';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import Footer from './components/Footer';
import {Routes,Route} from "react-router-dom";
import Success from "./components/Success"
import Cancel from "./components/Cancel"
function App() {
  return (
  <>
   <Header />
   <Home/>
   <Routes>
     <Route path='/' element={<Cards />} />
     <Route path='/login' element={<Login />} />
     <Route path='/Signup' element={<Signup/>} />
     <Route path='/cart/:id' element={<CardsDetails />} /> 
     <Route path='/Success' element={<Success />} />
     <Route path='/Cancel' element={<Cancel />} />    
   </Routes>
   <Footer/>
  </>
  );
}

export default App;
