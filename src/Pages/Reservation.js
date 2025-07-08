import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
  getRoomById,
  getOccupiedDates,
  createReservation,
  calculateReservationPrice
} from '../api/roomService';

const ReservationPage = () => {
  const { id } = useParams(); // Uzima ID sobe iz URL-a
  const navigate = useNavigate();

  const [room, setRoom] = useState(null); // Drži podatke o sobi
  const [email, setEmail] = useState('');
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [guests, setGuests] = useState([{ name: '' }]);
  const [promoCode, setPromoCode] = useState('');
  const [reservedDates, setReservedDates] = useState([]); // Zauzeti datumi
  const [errorMessage, setErrorMessage] = useState(''); // Definisanje state za errorMessage
  const [showPopup, setShowPopup] = useState(false); // Definisanje state za showPopup
  const [errors, setErrors] = useState({});

  const [price, setPrice] = useState(null); // Čuva izračunatu cenu

  useEffect(() => {
    // Dohvatanje podataka o sobi sa servera
    getRoomById(id)
  .then(data => setRoom(data))
  .catch(error => console.error('Greška pri dobijanju sobe:', error));
  }, [id]);

 useEffect(() => {
    getOccupiedDates(id)
      .then(data => {
        const transformed = data.map(d => d.split('T')[0]);
        setReservedDates(transformed);
      })
      .catch(error => console.error('Greška pri zauzetim datumima:', error));
  }, [id]);

const isDateReserved = (date) => {
    const dateString = date.toISOString().split('T')[0]; // Konvertujemo u "YYYY-MM-DD"
    return reservedDates.includes(dateString); // Proveravamo da li postoji u listi zauzetih datuma
  };

  const handleGuestChange = (index, event) => {
    const newGuests = [...guests];
    newGuests[index].name = event.target.value;
    setGuests(newGuests);
  };

  const addGuest = () => {
    if (guests.length < room.capacity) {
      setGuests([...guests, { name: '' }]);
    }
  };

  const removeGuest = (index) => {
    if (guests.length > 1) {
      const newGuests = [...guests];
      newGuests.splice(index, 1);
      setGuests(newGuests);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!email) validationErrors.email = 'Email je obavezan.';
    if (!checkInDate || !checkOutDate) validationErrors.dates = 'Datum od i datum do su obavezni.';
    if (guests.some((guest) => !guest.name)) validationErrors.guests = 'Svi gosti moraju imati ime.';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setErrorMessage('Molimo popunite sva obavezna polja.');
      setShowPopup(true); // Prikazivanje popup poruke
    } else {
      const reservationData = {
        roomId: room.id,
        checkInDate: checkInDate.toISOString().split('T')[0],
        checkOutDate: checkOutDate.toISOString().split('T')[0],
        email: email,
        promoCode: promoCode,
        guestNames: guests.map(guest => guest.name),
      };

      fetch('https://localhost:7172/api/Reservations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
      })
        .then(async (response) => {
          if (!response.ok) {
            // Ako je odgovor greška, parsiraj JSON telo greške
            const errorData = await response.json();
            throw new Error(errorData.message || 'Došlo je do greške.');
          }
          return response.json(); // Ako je sve u redu, parsiraj podatke
        })
        .then((data) => {
          // Ako je uspešno, navigacija na stranicu potvrde
          navigate('/confirmation', {
            state: {
              room: room,
              checkInDate: checkInDate.toISOString().split('T')[0],
              checkOutDate: checkOutDate.toISOString().split('T')[0],
              email,
              guestNames: guests.map((guest) => guest.name),
              promoCode,
              totalPrice: data.reservation.totalPrice,
              reservationToken: data.reservation.token,
              newPromoCode: data.promoCode.code,
              discount: data.promoCode.discountPercentage,
            },
          });
        })
        .catch((error) => {
          console.error('Greška prilikom slanja rezervacije:', error);
          setErrorMessage(error.message); // Postavi poruku greške iz API odgovora
          setShowPopup(true); // Prikaži popup sa greškom
        });
      
    }
  };

  //samo za izgled iskljucivo unosa datuma
  const CustomInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
    <input
      style={styles.input}
      value={value}
      onClick={onClick}
      placeholder={placeholder}
      readOnly
      ref={ref}
    />
  ));

  const calculatePrice = () => {
    if (!checkInDate || !checkOutDate) {
      setErrorMessage('Morate uneti datum dolaska i odlaska za izračunavanje cene.');
      setShowPopup(true);
      return;
    }
  
    const priceRequestData = {
      roomId: room.id,
      checkInDate: checkInDate.toISOString(),
      checkOutDate: checkOutDate.toISOString(),
      email,
      promoCode,
      guestNames: guests.map((guest) => guest.name || ""),
    };
  
    fetch('https://localhost:7172/api/Reservations/calculate-price', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(priceRequestData),
    })
      .then(async(response) => {
        if (!response.ok) {
          const errorData = await response.json();
            throw new Error(errorData.message || 'Došlo je do greške.');
        }
        return response.json();
      })
      .then((data) => {
        setPrice(data.totalPrice);
        setErrorMessage('');
      })
      .catch((error) => {
        console.error('Greška prilikom dobijanja cene:', error);
        setErrorMessage(error.message);
        setShowPopup(true);
      });
  };
  


  if (!room) {
    return <p>Učitavanje podataka o sobi...</p>;
  }

  return (
    <div style={styles.container}>
      <h2>Rezervacija sobe: {room.name}</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.field}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Unesite email"
            style={styles.input}
          />
          {errors.email && <p style={styles.error}>{errors.email}</p>}
        </div>

        <div style={styles.field}>
          <label>Datum od: </label>
          <DatePicker
            selected={checkInDate}
            onChange={(date) => setCheckInDate(date)}
            minDate={new Date()}
            filterDate={(date) => !isDateReserved(date)}
            placeholderText="yyyy/MM/dd"
            dateFormat="yyyy/MM/dd"
            customInput={<CustomInput />}
          />
        </div>

        <div style={styles.field}>
          <label>Datum do: </label>
          <DatePicker
            selected={checkOutDate}
            onChange={(date) => setCheckOutDate(date)}
            minDate={checkInDate || new Date()}
            filterDate={(date) => !isDateReserved(date)}
            placeholderText="yyyy/MM/dd"
            dateFormat="yyyy/MM/dd"
            customInput={<CustomInput />}
          />
        </div>

        <div style={styles.field}>
          <label>Gosti:</label>
          {guests.map((guest, index) => (
            <div key={index} style={styles.guest}>
              <input
                type="text"
                value={guest.name}
                onChange={(e) => handleGuestChange(index, e)}
                placeholder={`Ime gosta ${index + 1}`}
                style={styles.input}
              />
              {guests.length > 1 && (
                <button type="button" onClick={() => removeGuest(index)} style={styles.removeGuest}>
                  Ukloni
                </button>
              )}
            </div>
          ))}
          {guests.length < room.capacity && (
            <button type="button" onClick={addGuest} style={styles.addGuest}>
              Dodaj gosta
            </button>
          )}
          {errors.guests && <p style={styles.error}>{errors.guests}</p>}
        </div>

        <div style={styles.field}>
          <label>Promo kod (opciono):</label>
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Unesite promo kod"
            style={styles.input}
          />
        </div>

        <button type="button" onClick={calculatePrice} style={styles.calculateButton}>
  Izračunaj cenu
</button>
{price !== null && (
  <div style={styles.priceContainer}>
    <p>Ukupna cena: {price} RSD</p>
  </div>
)}
<div> <br /> </div>

        <button type="submit" style={styles.submitButton}>Rezerviši</button>
      </form>
      {showPopup && (
        <div style={styles.popup}>
          <p>{errorMessage}</p>
        </div>
      )}
      <div style={styles.centarDiv}>
      <button onClick={() => navigate('/')} style={styles.homeButton}>
        Vratite se na početnu stranicu
      </button>
      </div>
     
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
    },
    field: {
      marginBottom: '15px',
    },
    input: {
      width: '100%',
      padding: '8px',
      marginTop: '5px',
      border: '1px solid #ccc',
      borderRadius: '4px',
    },
    guest: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px',
    },
    removeGuest: {
      marginLeft: '10px',
      backgroundColor: '#ff4d4d',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      padding: '5px 10px',
      cursor: 'pointer',
    },
    addGuest: {
      marginTop: '10px',
      backgroundColor: '#4CAF50',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      padding: '5px 10px',
      cursor: 'pointer',
    },
    submitButton: {
      backgroundColor: '#007bff',
      color: '#fff',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      width: '100%',
    },
    error: {
      color: 'red',
      fontSize: '14px',
    },
    calculateButton: {
        marginTop: '10px',
        backgroundColor: '#17a2b8',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        padding: '10px 20px',
        cursor: 'pointer',
        width: '100%',
      },
      priceContainer: {
        marginTop: '15px',
        padding: '10px',
        backgroundColor: '#e9ecef',
        borderRadius: '4px',
        textAlign: 'center',
      },
      homeButton: {
        marginTop: '15px',
        backgroundColor: '#9aadb8',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        padding: '10px 20px',
        cursor: 'pointer',
        width: '40%',
      },

      centarDiv: {
        display: 'flex',
    justifyContent: 'center',
    alignItems: 'center', // Opcionalno za vertikalno centriranje
      },
      
  };
  

export default ReservationPage;
