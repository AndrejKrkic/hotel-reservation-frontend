import './Home.css';
import React, { useEffect, useState } from 'react';

import RoomCard from './Components/RoomCard';

const Home = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch('https://localhost:7172/api/Room') // Prilagodi URL
      .then((response) => response.json())
      .then((data) => setRooms(data))
      .catch((error) => console.error('Error fetching rooms:', error));
  }, []);

  return (
    <div>

      <div>
        <div className='imageClass'>
          <img className='fullWidthImage' src={'https://us.images.westend61.de/0001894565pw/happy-cheerful-group-of-friends-having-breakfast-in-a-farmhouse-young-people-eating-in-the-garden-concepts-about-healthy-lifestyle-and-food-DMDF05718.jpg'} alt={'Full-width image'} />
        </div>

      </div>


      <div >

        <h1 className='naslov'> Dobrodošli u FONsion</h1>

        <p className='testKlasa'>
          Naš hotel nudi savršen spoj udobnosti, luksuza i modernog dizajna.
        </p>

        <p className='testKlasa'>
          Otkrijte sobe koje će učiniti vaš boravak nezaboravnim.
        </p>

        <p className='hotelDescription'>
          FONsion je moderno i elegantno prenoćište smešteno u samom srcu Beograda. Nudi udoban i nezaboravan boravak, bilo da ste poslovni putnik, par na odmoru ili porodica koja želi da istražuje.

          Naš hotel se ponosi visokim standardom usluge i udobnosti. Sve sobe su klimatizovane i opremljene modernim sadržajima, kao što su besplatan Wi-Fi, TV sa velikim ekranom, mini-bar i sef. Gostima je na raspolaganju i 24-časovna recepcija, room service, restoran koji nudi ukusna jela domaće i internacionalne kuhinje, bar, fitnes centar i spa centar.

          FONsion je idealna polazna tačka za istraživanje Beograda i njegove okoline. Nalazimo se u blizini svih važnih znamenitosti, prodavnica i restorana. Šta čekaš, rezerviši odmah!

        </p>


        
        <div className='sobe'>
        <h2 className='dostupneSobeTekst'>Dostupne sobe</h2>
          <div style={{ padding: '60px', }}>
          <div style={styles.roomList}>
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <RoomCard
                key={room.id}
                id={room.id}
                name={room.name}
                capacity={room.capacity}
                description={room.description}
                pricePerNight={room.pricePerNight}
              //imageUrl={room.imageUrl} // URL slike sobe iz baze
              />
            ))
          ) : (
            <p>Trenutno nema dostupnih soba.</p>
          )}
        </div>

          </div>

        
          
        </div>
        
      </div>

    </div>

  );
};

const styles = {
  roomList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
  },
};
export default Home;

