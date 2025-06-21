import React, { useState } from 'react';
import {useNavigate } from 'react-router-dom';

const ReservationLookup = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [reservation, setReservation] = useState(null);
  const [guests, setGuests] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const fetchReservation = () => {
    fetch(`https://localhost:7172/api/Reservations/get-reservation?token=${token}&email=${email}`)
      .then(async (response) => {
        if (!response.ok) {
          // throw new Error('Rezervacija nije pronađena.');
          const errorData = await response.json();
            throw new Error(errorData.message || 'Došlo je do greške. Proverite podatke i pokušajte ponovo.');
        }
        return response.json();
      })
      .then((data) => {
        setReservation(data.reservation);
        setGuests(data.guests);
        setErrorMessage('');
      })
      .catch((error) => {
        console.error('Greška:', error);
        setErrorMessage(error.message);
      });
  };

  const cancelReservation = () => {
    const url = `https://localhost:7172/api/Reservations/cancel?reservationId=${reservation.id}`;
    
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Neuspešno otkazivanje rezervacije.');
        }
        setReservation({ ...reservation, status: 'Cancelled' });
        alert('Rezervacija je uspešno otkazana.');
      })
      .catch((error) => {
        console.error('Greška:', error);
        alert('Došlo je do greške prilikom otkazivanja rezervacije.');
      });
  };
  

  return (
    <div style={styles.container}>
      <h2>Pronađite rezervaciju</h2>
      <div style={styles.form}>
        <input
          type="email"
          placeholder="Unesite email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Unesite token rezervacije"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          style={styles.input}
        />
        <button onClick={fetchReservation} style={styles.button}>
          Pronađi rezervaciju
        </button>
      </div>
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}

      {reservation && (
        <div style={styles.details}>
          <h3>Detalji rezervacije</h3>
          <div style={styles.detailItem}>
            <strong>Email:</strong> {reservation.email}
          </div>
          <div style={styles.detailItem}>
            <strong>Status:</strong> {reservation.status}
          </div>
          <div style={styles.detailItem}>
            <strong>Datum od:</strong> {new Date(reservation.checkIn).toLocaleDateString()}
          </div>
          <div style={styles.detailItem}>
            <strong>Datum do:</strong> {new Date(reservation.checkOut).toLocaleDateString()}
          </div>
          <div style={styles.detailItem}>
            <strong>Ukupna cena:</strong> {reservation.totalPrice} EUR
          </div>
          <div style={styles.detailItem}>
            <strong>Gosti:</strong> {guests.map((guest) => guest.name).join(', ')}
          </div>
          {reservation.status !== 'Cancelled' && (
            <button onClick={cancelReservation} style={styles.cancelButton}>
              Otkazivanje rezervacije
            </button>
          )}
        </div>
      )}
      <button onClick={() => navigate('/')} style={styles.button}>
        Vratite se na početnu stranicu
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    textAlign: 'center',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  form: {
    marginBottom: '20px',
  },
  input: {
    margin: '10px 0',
    padding: '10px',
    width: '100%',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cancelButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  details: {
    marginTop: '20px',
    textAlign: 'left',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
  },
  detailItem: {
    marginBottom: '10px',
  },
  error: {
    color: '#dc3545',
  },
};

export default ReservationLookup;