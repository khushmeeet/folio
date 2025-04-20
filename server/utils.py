import httpx
from bs4 import BeautifulSoup


async def fetch_url_metadata(url: str):
    """Fetch title and description from a URL"""
    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=10.0) as client:
            response = await client.get(url)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, 'html.parser')

            title = None
            title_tag = soup.find('title')
            if title_tag and title_tag.string:
                title = title_tag.string.strip()

            description = None
            meta_desc = soup.find('meta', attrs={'name': 'description'}) or \
                       soup.find('meta', attrs={'property': 'og:description'})
            if meta_desc and meta_desc.get('content'):
                description = meta_desc['content'].strip()

            return title, description
    except Exception as e:
        print(f"Error fetching metadata for {url}: {str(e)}")
        return None, None
