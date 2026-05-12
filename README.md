# Harmony Panorama Code & Packer
[PKZip File Structure](https://users.cs.jmu.edu/buchhofp/forensics/formats/pkzip.html)

Files from `resources/` should go into `csgo/panorama/`

# Usage
## Unpacking code.pbin
Run the following commands
```bash
python pbin.py unpack path/to/code.pbin
```

## Packaging code_harmony.pbin
First, extract the original code.pbin if you haven't already.
Make any acceptable changes to the panorama code.

Run the following commands
```bash
python pbin.py pack
```