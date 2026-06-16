function json(res, status, payload) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(status).setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify(payload));
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'method_not_allowed' });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) {
      return json(res, 500, { ok: false, error: 'openai_not_configured' });
    }

    const { prompt } = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    if (!prompt) {
      return json(res, 400, { ok: false, error: 'prompt_required' });
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model: 'gpt-4.1-mini', input: prompt }),
    });

    const data = await response.json();
    if (!response.ok) {
      return json(res, 500, { ok: false, error: data.error?.message || 'openai_error' });
    }

    return json(res, 200, { ok: true, output_text: data.output_text || '' });
  } catch (err) {
    return json(res, 500, { ok: false, error: err.message });
  }
}
