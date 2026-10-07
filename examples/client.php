<?php
declare(strict_types=1);

final class DNSHEClient
{
    private string $baseUrl;
    private string $apiKey;
    private string $apiSecret;
    private int $timeout;

    public function __construct(string $baseUrl, string $apiKey, string $apiSecret, int $timeout = 15)
    {
        if (parse_url($baseUrl, PHP_URL_SCHEME) !== 'https') {
            throw new InvalidArgumentException('HTTPS is required');
        }
        if ($apiKey === '' || $apiSecret === '') {
            throw new InvalidArgumentException('API credentials are required');
        }
        $this->baseUrl = $baseUrl;
        $this->apiKey = $apiKey;
        $this->apiSecret = $apiSecret;
        $this->timeout = $timeout;
    }

    public function request(string $endpoint, ?string $action = null, string $method = 'GET', array $data = []): array
    {
        $parts = parse_url($this->baseUrl);
        parse_str($parts['query'] ?? '', $query);
        $query['m'] = 'domain_hub';
        $query['endpoint'] = $endpoint;
        unset($query['action']);
        if ($action !== null) $query['action'] = $action;
        $headers = ['X-API-Key: ' . $this->apiKey, 'X-API-Secret: ' . $this->apiSecret];
        $body = null;
        if ($method === 'GET') {
            $query = array_merge($query, $data);
        } else {
            $headers[] = 'Content-Type: application/json';
            $body = json_encode($data, JSON_THROW_ON_ERROR);
        }
        $url = 'https://' . $parts['host'] . (isset($parts['port']) ? ':' . $parts['port'] : '')
            . ($parts['path'] ?? '/') . '?' . http_build_query($query);
        $handle = curl_init($url);
        if ($handle === false) throw new RuntimeException('Cannot initialize cURL');
        try {
            curl_setopt_array($handle, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_CUSTOMREQUEST => $method,
                CURLOPT_HTTPHEADER => $headers,
                CURLOPT_CONNECTTIMEOUT => $this->timeout,
                CURLOPT_TIMEOUT => $this->timeout,
                CURLOPT_FOLLOWLOCATION => false,
            ]);
            if ($body !== null) curl_setopt($handle, CURLOPT_POSTFIELDS, $body);
            $raw = curl_exec($handle);
            if ($raw === false) throw new RuntimeException('Transport error: ' . curl_error($handle));
            $status = (int) curl_getinfo($handle, CURLINFO_HTTP_CODE);
        } finally {
            curl_close($handle);
        }
        try {
            $result = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException $error) {
            throw new RuntimeException('Invalid JSON response (HTTP ' . $status . ')', 0, $error);
        }
        if (!is_array($result)) throw new RuntimeException('Expected a JSON object');
        if ($status < 200 || $status >= 300 || ($result['success'] ?? null) === false) {
            throw new RuntimeException(($result['error_code'] ?? 'http_error') . ': '
                . ($result['message'] ?? $result['error'] ?? ('HTTP ' . $status)), $status);
        }
        return $result;
    }
}
