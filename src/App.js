import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import ReservationPage from './Pages/Reservation'; // Putanja do komponente
import ConfirmationPage from './Pages/Confirmation';
import ReservationLookup from './Pages/ReservationLookup';
import TopBar from './Components/TopBar';

const App = () => {
  return (
    <Router>
     <div>
        {/* Navigaciona traka */}
        <TopBar />
        {/* Glavni sadržaj */}
        <div style={{ paddingTop: '60px' }}> {/* Dodaj padding za prostor ispod TopBar-a */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reserve/:id" element={<ReservationPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="/reservation-lookup" element={<ReservationLookup />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;