const NOTION_SECRET = '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';
const NOTION_DB_ID  = '31269d40cc2b801b8515e51a2bc04069';

exports.handler = async function(event) {
  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Netlify sends form submissions as URL-encoded body
    const params = new URLSearchParams(event.body);
    const name    = params.get('name')    || '';
    const email   = params.get('email')   || '';
    const message = params.get('message') || '';
    const date    = new Date().toISOString().split('T')[0];

    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_SECRET}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_DB_ID },
        properties: {
          Name: {
            title: [{ text: { content: name } }]
          },
          Email: {
            email: email
          },
          Text: {
            rich_text: [{ text: { content: message } }]
          },
          Date: {
            date: { start: date }
          }
        }
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Notion API error:', err);
      return { statusCode: 500, body: 'Failed to save to Notion' };
    }

    return { statusCode: 200, body: 'OK' };

  } catch (err) {
    console.error('Function error:', err);
    return { statusCode: 500, body: 'Server error' };
  }
};
