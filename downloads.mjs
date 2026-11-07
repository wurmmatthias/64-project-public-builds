export const REPOSITORY = 'wurmmatthias/64-project-public-builds';
export const RELEASES_URL = `https://github.com/${REPOSITORY}/releases`;
export const PLATFORMS = [
  { id: 'windows-x64', label: 'Windows', suffix: 'windows-x64.zip' },
  { id: 'linux-x64', label: 'Linux', suffix: 'linux-x64.tar.gz' },
  { id: 'macos-arm64', label: 'Mac · Apple Silicon', suffix: 'macos-arm64.tar.gz' },
  { id: 'macos-x64', label: 'Mac · Intel', suffix: 'macos-x64.tar.gz' },
  { id: 'rg35xx-pro-aarch64', label: 'RG35XX Pro', suffix: 'rg35xx-pro-aarch64.zip' }
];

// Only offer matching runtime archives from our public repository.
export function platformAsset(release, platform = 'windows-x64') {
  const target = PLATFORMS.find(candidate => candidate.id === platform);
  if (!target || !/^v[0-9][A-Za-z0-9._-]*$/.test(release?.tag_name)) return undefined;
  return release?.assets?.find(asset => {
    if (asset.name !== `Whiskerwild-${release.tag_name}-${target.suffix}`) return false;
    try {
      const url = new URL(asset.browser_download_url);
      return url.origin === 'https://github.com' &&
        url.pathname === `/${REPOSITORY}/releases/download/${release.tag_name}/${asset.name}`;
    } catch { return false; }
  });
}

export function selectRelease(releases, platform = 'windows-x64') {
  if (!Array.isArray(releases)) throw new TypeError('Expected a list of releases.');
  const available = releases.filter(release => !release.draft && platformAsset(release, platform));
  available.sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at));
  return available.find(release => !release.prerelease) ?? available[0] ?? null;
}

export async function showDownload(document, fetcher = fetch) {
  let releases;
  try {
    const response = await fetcher(`https://api.github.com/repos/${REPOSITORY}/releases?per_page=100`, {
      headers: { Accept: 'application/vnd.github+json' },
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) throw new Error(`Release lookup failed: ${response.status}`);
    releases = await response.json();
    if (!Array.isArray(releases)) throw new TypeError('Expected a list of releases.');
  } catch {
    for (const { id, label } of PLATFORMS) {
      document.getElementById(`${id}-status`).textContent = `Find ${label} builds on our releases page.`;
      const button = document.getElementById(`${id}-download`);
      button.href = RELEASES_URL;
      button.textContent = 'View available builds ↗';
    }
    return;
  }
  for (const { id, label } of PLATFORMS) {
    const status = document.getElementById(`${id}-status`);
    const button = document.getElementById(`${id}-download`);
    const release = selectRelease(releases, id);
    if (!release) {
      status.textContent = `The first ${label} build is on its way. Check back soon.`;
      button.href = RELEASES_URL;
      button.textContent = 'Visit the releases page ↗';
      continue;
    }
    const asset = platformAsset(release, id);
    const size = Number.isFinite(asset.size) ? ` · ${(asset.size / 1024 / 1024).toFixed(1)} MB` : '';
    status.textContent = `${release.tag_name}${release.prerelease ? ' · Preview build' : ' · Latest release'}${size}`;
    button.href = asset.browser_download_url;
    button.textContent = `Download for ${label} ↓`;
  }
}

if (typeof document !== 'undefined') showDownload(document);
