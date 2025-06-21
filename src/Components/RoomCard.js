import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RoomCard.css';

const RoomCard = ({id, name, capacity, description, pricePerNight}) => {
    const navigate = useNavigate();
  return (
    <div style={styles.card}>
      <img src={'https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?cs=srgb&dl=pexels-fotoaibe-1669799.jpg&fm=jpg'} alt={name} style={styles.image} />
      <div className='cardDiv' style={styles.content}>
        <h3>{name}</h3>
        <p><strong>Kapacitet:</strong> {capacity} osoba</p>
        <p>{description}</p>
        <p><strong>Cena:</strong> {pricePerNight} RSD po noći</p>
        <button style={styles.button} onClick={() => navigate(`/reserve/${id}`)}>Rezerviši
        </button>

      </div>
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ccc',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '300px',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  content: {
    padding: '15px',
  },
  button: {
    marginTop: 'auto', // Dugme se pozicionira na dno
    padding: '10px 15px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default RoomCard;
