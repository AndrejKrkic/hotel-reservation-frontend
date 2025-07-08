const BASE_URL = 'https://localhost:7172/api';

export const getRoomById = async (id) => {
  const response = await fetch(`${BASE_URL}/Room/${id}`);
  if (!response.ok) {
    throw new Error('Greška prilikom dobijanja sobe.');
  }
  return await response.json();
};

export const getOccupiedDates = async (roomId) => {
  const response = await fetch(`${BASE_URL}/Reservations/occupied-dates/${roomId}`);
  if (!response.ok) {
    throw new Error('Greška prilikom dobijanja zauzetih datuma.');
  }
  return await response.json();
};

export const createReservation = async (data) => {
  const response = await fetch(`${BASE_URL}/Reservations/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Došlo je do greške.');
  }

  return await response.json();
};

export const calculateReservationPrice = async (data) => {
  const response = await fetch(`${BASE_URL}/Reservations/calculate-price`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Došlo je do greške.');
  }

  return await response.json();
};

export async function fetchRooms() {
  const response = await fetch('https://localhost:7172/api/Room');
  if (!response.ok) {
    throw new Error('Failed to fetch rooms');
  }
  return await response.json();
}