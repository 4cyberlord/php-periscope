const axios = require("axios");

async function searchPackages(query)
{
  const url = `https://packagist.org/search.json?q=${query}`;

  try
  {
    const response = await axios.get(url);

    if (!response.data.results || !Array.isArray(response.data.results))
    {
      throw new Error('Invalid API response');
    }

    return response.data.results.map(result => ({
      label: result.name,
      description: result.description,
      detail: result.url
    }));
  } catch (error)
  {
    console.error(`Error searching for packages: ${error.message}`);
    return [];
  }
}

module.exports = {
  searchPackages
};
