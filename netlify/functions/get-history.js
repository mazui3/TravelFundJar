// netlify/functions/get-history.js
export async function handler(event) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  // Get the specific filename from the URL parameters
  const { file } = event.queryStringParameters;

  const url = `https://raw.githubusercontent.com/mazui3/TravelFundJarData/main/${file}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });

    if (!response.ok) throw new Error(`GitHub responded with ${response.status}`);

    const data = await response.json();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
