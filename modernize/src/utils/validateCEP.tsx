import getGeoLocation from "./getGeolocation";

const validateCEP = async (cep: string) => {

    if (!cep) {
      console.log('CEP não fornecido');
      return false;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (response.ok && data.cep) {

        const address = data.logradouro + " " + data.localidade + " " + data.uf + " " + data.cep;
        const location = await getGeoLocation(data.logradouro + " " + data.localidade + " " + data.uf + " " + data.cep);

        return {address: address, location: location};
      } else {
        console.log('CEP inválido');
        return false;
      }
    } catch (error) {
      console.error('Error validating CEP:', error);
      return false;
    }
  }

  export default validateCEP;