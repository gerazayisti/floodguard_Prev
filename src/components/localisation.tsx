//@ts-nocheck
import React, { useEffect } from 'react';

const LocationComponent = ({ onLocationChange }) => {

  // Fonction pour récupérer la position sur le web
  const getLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Position obtenue :", latitude, longitude);

          // Appeler la fonction de rappel avec les coordonnées
          if (onLocationChange) {
            onLocationChange(latitude, longitude);
          }
        },
        (error) => {
          console.error('Erreur lors de la récupération de la localisation', error);
          alert('Erreur lors de la récupération de la localisation');
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    } else {
      alert("La géolocalisation n'est pas supportée par ce navigateur.");
    }
  };

  useEffect(() => {
    getLocation(); // Récupérer la position lors du montage du composant
  }, []);

  return null;  // Pas de rendu visuel
};

export default LocationComponent;
