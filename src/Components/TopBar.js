import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TopBar.css';

const TopBar = () => {
  const navigate = useNavigate();

  const handleViewReservations = () => {
    navigate('/reservation-lookup');
  };

  const handleHomeBUtton = () => {
    navigate('/');
  };

  const styles = {
    topBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      backgroundColor: '#007bff',
      color: '#fff',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
    },
    hotelName: {
      fontSize: '20px',
      fontWeight: 'bold',

      cursor: 'pointer',
    },
    button: {
      backgroundColor: '#fff',
      color: '#007bff',
      border: 'none',
      borderRadius: '4px',
      padding: '8px 15px',
      cursor: 'pointer',
      marginRight: '40px',  // Razmak od desne ivice
    },
  };

  return (
    <div style={styles.topBar}>
      <div style={styles.hotelName} onClick={handleHomeBUtton}>FONsion</div>
      <button style={styles.button} onClick={handleViewReservations}>
        Pregled rezervacija
      </button>
    </div>
  );
};

export default TopBar;
