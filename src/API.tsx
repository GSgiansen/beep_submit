const callApi = async () => {

  const apiUrl = process.env.REACT_APP_API_URL as string;
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const jsonData = await response.json();
  return jsonData;
}

export default callApi;