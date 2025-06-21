import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Ovdje pretpostavljamo da su podaci prosleđeni preko location.state
  const { room, checkInDate, checkOutDate, email, guestNames, promoCode, totalPrice, 
    reservationToken, 
    newPromoCode, 
    discount  } = location.state || {};

  if (!room) {
    return <p>Podaci o rezervaciji nisu pronađeni.</p>;
  }

  return (
    <div style={styles.container}>
      <h2>Uspešna rezervacija</h2>
      <p>Vaša rezervacija je uspešno izvršena! Detalji rezervacije su prikazani u nastavku.</p>

      <div style={styles.details}>
        <div style={styles.detailItem}>
          <strong>Soba:</strong> {room.name}
        </div>
        <div style={styles.detailItem}>
          <strong>Kapacitet:</strong> {room.capacity} osoba
        </div>
        <div style={styles.detailItem}>
          <strong>Email:</strong> {email}
        </div>
        <div style={styles.detailItem}>
          <strong>Datum od:</strong> {checkInDate}
        </div>
        <div style={styles.detailItem}>
          <strong>Datum do:</strong> {checkOutDate}
        </div>
        <div style={styles.detailItem}>
          <strong>Gosti:</strong> {guestNames.join(', ')}
        </div>
        {promoCode && (
          <div style={styles.detailItem}>
            <strong>Iskroišćen promo kod:</strong> {promoCode}
          </div>
        )}
      </div>
      <div style={styles.detailItem}>
    <strong>Ukupna cena:</strong> {totalPrice} RSD
  </div>
  <div style={styles.detailItem}>
    <strong>Token rezervacije:</strong> {reservationToken}
  </div>
  {newPromoCode && (
    <>
      <div style={styles.detailItem}>
        <strong>Novi promo kod:</strong> {newPromoCode}
      </div>
      <div style={styles.detailItem}>
        <strong>Popust za novi promo kod:</strong> {discount}%
      </div>
    </>
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
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
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
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default ConfirmationPage;
