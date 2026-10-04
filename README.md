# panorama-code

Maintained by [lpta](https://github.com/liptaciak) and [heapy](https://github.com/heapyxyz) for [Harmony](https://harmony.heapy.xyz/).

This repository contains the Panorama (in-game UI) files for [Harmony](https://harmony.heapy.xyz/) and a Python utility script for extracting Panorama files from `code.pbin` and packing modified files from the `panorama/` directory into `code_harmony.pbin`.

> [!WARNING]
> In order for CS:GO to load custom `code.pbin` correctly, you have to use custom `panorama.dll/panorama_[gl/vulkan]_client.so` library which skips signature checks. If you plan using this project for [Harmony](https://harmony.heapy.xyz/), it already skips signature checking for `code_harmony.pbin`.

## Usage

### Unpacking `code.pbin`

Run the following command:

```bash
python pbin.py unpack path/to/code.pbin
```

If you're using `uv`, run this instead:

```bash
uv run pbin.py unpack path/to/code.pbin
```

### Packing `code_harmony.pbin`

1. Get the Panorama code - either unpack original `code.pbin` from game files (if you want to modify the original Panorama code) or use the existing Harmony Panorama files inside the `panorama` folder.
2. Make any acceptable changes to the panorama code.
3. Run the following command:

```bash
python pbin.py pack
```

If you're using `uv`, run this instead:

```bash
uv run pbin.py pack
```

Packaged Panorama code will be saved as `code_harmony.pbin`.

## Adding Resources

Files from `resources/` should go into `csgo/panorama/`, for example: `file://{resources}/images/harmony_logo.png` should be placed inside `csgo/panorama/images/harmony_logo.png`.

Resource usage example (Panorama XML):

```xml
<Image textureheight="32" texturewidth="-1" src="file://{resources}/images/harmony_logo.png" />
```

## Contributing

Contributions to the project are welcome.

### Pull Requests

Before opening a pull request, make sure that:

- Your changes are related to Harmony Panorama code.
- The project still builds and works correctly.
- You have tested your changes where possible.
- You have described what was changed.

For larger changes, especially changes that may affect compatibility with Harmony, please explain what was changed and why.

### Compatibility

Changes to the Panorama code should avoid breaking existing Harmony functionality.

### Questions

If you are unsure about a change, feel free to open an issue before working on it.

## Credits

- [Panorama API](https://developer.valvesoftware.com/wiki/CSGO_Panorama_API) - Valve Developer Community
- [Panorama CSS Properties](https://developer.valvesoftware.com/wiki/Panorama/Overview/CSS_Properties) - Valve Developer Community
- [PKZip File Structure](https://users.cs.jmu.edu/buchhofp/forensics/formats/pkzip.html) - Florian Buchholz
