# Whiskerwild

Small paws. Wild islands. A little retro 3D adventure starring a brave warrior cat.
Explore ten procedurally generated islands, collect golden crystals, fight with
sword and bow, and make your cat your own.

**[Visit the game page](https://wurmmatthias.github.io/64-project-public-builds/)**
· **[Download a build](https://github.com/wurmmatthias/64-project-public-builds/releases)**

## Play

Download the archive matching your computer from Releases and extract all files:

| Platform | Archive suffix | Start |
| --- | --- | --- |
| Windows x64 | `windows-x64.zip` | `island64.exe` |
| Linux x64 | `linux-x64.tar.gz` | `./play.sh` in a terminal |
| Mac Apple Silicon | `macos-arm64.tar.gz` | `Play.command` |
| Mac Intel | `macos-x64.tar.gz` | `Play.command` |
| RG35XX Pro (experimental) | `rg35xx-pro-aarch64.zip` | Copy `Whiskerwild.sh` and `whiskerwild/` into Ports |

All builds include runtime assets and license notices. Desktop builds require OpenGL 3.3.
Linux requires Ubuntu 22.04 or a compatible newer distribution with X11/XWayland
and system OpenGL/ALSA libraries. Mac builds require macOS 15+ and are not
notarized; if macOS blocks opening, allow the game in System Settings → Privacy
& Security. The game is in development.

The experimental RG35XX Pro package targets stock ANBERNIC 64-bit firmware with
its SDL2/Mali and GLES 3.0 drivers (glibc 2.31 baseline). Copy the launcher and
game folder into `Roms/PORTS`; open RA Game -> PORTS -> Whiskerwild. It also has a
PortMaster launch path. Read INSTALL.txt. Testing on the physical handheld is
still needed.

This repository contains the public website and compiled releases. Game source
code is maintained separately. See the license notices shipped with each build
for its terms.

## Website

The site is plain HTML, CSS, and JavaScript; no build tools are needed. In this
repository's **Settings → Pages**, select **Deploy from a branch**, **main**, and
**/(root)**. The download section reads this repository's public releases and
prefers the latest stable build for each platform independently, falling back to
a preview if that platform has no stable build. If GitHub's API is unavailable, the releases page remains linked.
