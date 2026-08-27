# Harmony Panorama Code & Packer
### **Created by [lpta](https://github.com/liptaciak) for [Harmony](https://harmony.heapy.xyz/)**
---
# Information
This repository contains the Panorama (in-game UI) files for [Harmony](https://harmony.heapy.xyz/) and a Python utility script for extracting Panorama files from `code.pbin` and packing modified files from the `panorama/` directory into `code_harmony.pbin`.

> [!WARNING]
> In order for CS:GO to load custom `code.pbin` correctly, you have to use custom `panorama.dll/panorama[_gl]_client.so` library which skips signature checks. If you plan using this project for [Harmony](https://harmony.heapy.xyz/), it already skips signature checking for `code_harmony.pbin`

# Usage
## Unpacking `code.pbin`
Run the following command
```bash
python pbin.py unpack path/to/code.pbin
```

## Packing `code_harmony.pbin`
1. Get the Panorama code
    1. Unpack original `code.pbin` from game files if you want to modify the original Panorama code.
    2. Or use the existing Harmony Panorama files inside the `panorama` folder.
2. Make any acceptable changes to the panorama code.
3. Run the following command:
```bash
python pbin.py pack
```
Packaged Panorama code will be output to `code_harmony.pbin`

## Adding Resources
Files from `resources/` should go into `csgo/panorama/`, for example: `resources/images/harmony_logo.png` should be placed inside `csgo/panorama/images/harmony_logo.png`

Resource usage example: (Panorama XML)
```xml
<Image textureheight="32" texturewidth="-1" src="file://{resources}/images/harmony_logo.png" />
```

# Contributing
Contributions to the project are welcome.

## Pull Requests
Before opening a pull request, make sure that:

- Your changes are related to Harmony Panorama code.
- The project still builds and works correctly.
- You have tested your changes where possible.
- You have described what was changed.

For larger changes, especially changes that may affect compatibility with Harmony, please explain what was changed and why.

## Compatibility
Changes to the Panorama code should avoid breaking existing Harmony functionality.

## Questions
If you are unsure about a change, feel free to open an issue before working on it.

## Resources used to create this repository
- [Panorama API](https://developer.valvesoftware.com/wiki/CSGO_Panorama_API) - Valve Developer Community
- [Panorama CSS Properties](https://developer.valvesoftware.com/wiki/Panorama/Overview/CSS_Properties) - Valve Developer Community
- [PKZip File Structure](https://users.cs.jmu.edu/buchhofp/forensics/formats/pkzip.html) - Florian Buchholz