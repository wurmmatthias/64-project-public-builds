export const REPOSITORY = 'wurmmatthias/64-project-public-builds';
export const RELEASES_URL = `https://github.com/${REPOSITORY}/releases`;

// Only offer the runtime ZIP from our public repository, never source archives.
export function windowsAsset(release) {
  return release?.assets?.find(asset => {
    if (!/^Whiskerwild-v[0-9][A-Za-z0-9._-]*-windows-x64\.zip$/.test(asset.name)) return false;
    try {
      const url = new URL(asset.browser_download_url);
      return url.origin === 'https://github.com' &&
        url.pathname.startsWith(`/${REPOSITORY}/releases/download/`);
    } catch { return false; }
  });
}

export function selectRelease(releases) {
  if (!Array.isArray(releases)) throw new TypeError('Expected a list of releases.');
  const available = releases.filter(release => !release.draft && windowsAsset(release));
  available.sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at));
  return available.find(release => !release.prerelease) ?? available[0] ?? null;
}

export async function loadDownload(fetcher = fetch) {
  const response = await fetcher(`https://api.github.com/repos/${REPOSITORY}/releases?per_page=100`, {
    headers: { Accept: 'application/vnd.github+json' },
    signal: AbortSignal.timeout(10000)
  });
  if (!response.ok) throw new Error(`Release lookup failed: ${response.status}`);
  const release = selectRelease(await response.json());
  if (!release) return null;
  return { release, asset: windowsAsset(release) };
}

export async function showDownload(document, fetcher = fetch) {
  const status = document.getElementById('release-status');
  const button = document.getElementById('download-button');
  try {
    const download = await loadDownload(fetcher);
    if (!download) {
      status.textContent = 'The first public build is on its way. Check back soon.';
      button.textContent = 'Visit the releases page ↗';
      return;
    }
    const { release, asset } = download;
    const size = Number.isFinite(asset.size) ? ` · ${(asset.size / 1024 / 1024).toFixed(1)} MB` : '';
    status.textContent = `${release.tag_name}${release.prerelease ? ' · Preview build' : ' · Latest release'}${size}`;
    button.href = asset.browser_download_url;
    button.textContent = 'Download for Windows ↓';
  } catch {
    status.textContent = 'Find the latest Windows ZIP on our releases page.';
    button.href = RELEASES_URL;
    button.textContent = 'View available builds ↗';
  }
}

if (typeof document !== 'undefined') showDownload(document);
