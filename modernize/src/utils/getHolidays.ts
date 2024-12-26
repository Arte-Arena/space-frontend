export const getHolidays = async (year: number, countryCode: string): Promise<any> => {
  const response = await fetch(`https://date.nager.at/Api/v2/PublicHolidays/${year}/${countryCode}`);
  const data = await response.json();
  return data;
};
