class FetchApi {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async fetchEndpoint(endpoint: string, options?: RequestInit): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, options);
    if (!response.ok) {
      console.error(`Error fetching ${url}: ${response.statusText}`);
      return false;
    }
    return response.json();
  }
}

export default FetchApi;