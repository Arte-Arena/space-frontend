const getGeoLocation = async (address: string): Promise<{ latitude: number; longitude: number } | null> => {
    try {
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
      } else {
        console.error('Endereço não encontrado');
        return null;
      }
    } catch (error) {
      console.error('Erro ao obter localização geográfica:', error);
      return null;
    }
  };

export default getGeoLocation;
