'use strict';

class DNSHEClient {
  constructor(baseUrl, apiKey, apiSecret, timeoutMs = 15000) {
    this.baseUrl = new URL(baseUrl);
    if (this.baseUrl.protocol !== 'https:') throw new Error('HTTPS is required');
    if (!apiKey || !apiSecret) throw new Error('API credentials are required');
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.timeoutMs = timeoutMs;
  }

  async request(endpoint, action = null, method = 'GET', data = {}) {
    const url = new URL(this.baseUrl);
    url.searchParams.set('m', 'domain_hub');
    url.searchParams.set('endpoint', endpoint);
    url.searchParams.delete('action');
    if (action !== null) url.searchParams.set('action', action);
    const options = {
      method,
      redirect: 'error',
      headers: { 'X-API-Key': this.apiKey, 'X-API-Secret': this.apiSecret },
      signal: AbortSignal.timeout(this.timeoutMs),
    };
    if (method === 'GET') {
      for (const [key, value] of Object.entries(data)) url.searchParams.set(key, String(value));
    } else {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(data);
    }
    const response = await fetch(url, options);
    let result;
    try { result = await response.json(); }
    catch { throw new Error(`Invalid JSON response (HTTP ${response.status})`); }
    if (result === null || typeof result !== 'object' || Array.isArray(result)) {
      throw new Error(`Expected a JSON object (HTTP ${response.status})`);
    }
    if (!response.ok || result.success === false) {
      const error = new Error(result.message || result.error || `HTTP ${response.status}`);
      error.status = response.status;
      error.code = result.error_code;
      error.details = result.details;
      throw error;
    }
    return result;
  }
}

module.exports = { DNSHEClient };
