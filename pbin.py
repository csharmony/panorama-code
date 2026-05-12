import os
import sys
import hashlib
from shutil import copyfile
import zlib

def file_md5(fname):
    hash_md5 = hashlib.md5()
    with open(fname, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

def create_path(path: str):
    path = path.split("\\")[:-1]

    tmp = ""
    for directory in path:
        try:
            os.mkdir(tmp + directory)
        except FileExistsError:
            pass
        tmp += directory + '\\'

def pk_header(header: bytes):
    pk = {}

    pk["signature"]         = header[0: ][:4]
    pk["version"]           = header[4: ][:2]
    pk["gpflag"]            = header[6: ][:2]
    pk["compression"]       = header[8: ][:2]
    pk["last_mod_time"]     = header[10:][:2]
    pk["last_mod_date"]     = header[12:][:2]
    pk["crc32"]             = header[14:][:4]
    pk["comp_size"]         = int.from_bytes(header[18:][:4], byteorder="little")
    pk["uncomp_size"]       = int.from_bytes(header[22:][:4], byteorder="little")
    pk["filename_length"]   = int.from_bytes(header[26:][:2], byteorder="little")

    return pk

def pbin_unpack(file_name: str):
    """
        Unpack all packed panorama files
            file_name = path to .pbin file
        Return codes:
            0 - no errors
            1 - file doesn't exist
            2 - invalid pbin file
    """

    pbin = {}

    try:
        with open(file_name, "rb") as f:
            pbin["signature"]   = f.read(4)
            pbin["rsa"]         = f.read(512)

            if pbin["signature"] == b"\x50\x41\x4e\x02":
                raw_header = b""
                while True:
                    raw_header = f.read(30)
                    pk = pk_header(raw_header)
                    if pk["signature"] == b"\x50\x4b\x03\x04":
                        file = f.read(pk["filename_length"]).decode(encoding="utf-8")

                        print(file)
                        create_path(file)

                        with open(file, "wb") as tmp:
                            tmp.write(f.read(pk["uncomp_size"]))
                            tmp.close()
                    else:
                        break
            else:
                sys.exit(2)

    except FileNotFoundError:
        return 1

    return 0

def pbin_pack():
    """
        Pack panorama folder to code_harmony.pbin
        Return codes:
            0 - no errors
    """

    output_file_content = b""
    output_file_content += b"\x50\x41\x4E\x02"
    output_file_content += b'\x00' * 512

    central_directory = b""
    entry_count = 0

    for root, dirs, files in os.walk("panorama"):
        for file in files:
            file_name = os.path.join(root, file).replace("/", "\\")
            file_size = os.stat(file_name).st_size
            
            file_data = b""
            with open(file_name, "rb") as f:
                file_data = f.read()
            
            file_crc = zlib.crc32(file_data) & 0xFFFFFFFF
            local_offset = len(output_file_content) - 516 # (we reduce signature and RSA size)

            output_file_content += b"\x50\x4B\x03\x04" # signature
            output_file_content += b"\x0A\x00" # version

            # flags, compression, mod time, mod date
            output_file_content += b"\x00" * 8

            output_file_content += file_crc.to_bytes(4, byteorder="little") # CRC
            output_file_content += file_size.to_bytes(4, byteorder="little") # compressed size
            output_file_content += file_size.to_bytes(4, byteorder="little") # uncompressed size
            output_file_content += len(file_name).to_bytes(4, byteorder="little") # filename length
            output_file_content += file_name.encode("utf-8") # filename
            output_file_content += file_data

            central_directory += b"\x50\x4B\x01\x02" # signature
            central_directory += b"\x14\x00" # no idea what that is, but it's always 0x14
            central_directory += b"\x0A\x00" # version
            
            # flags, compression, mod time, mod date
            central_directory += b"\x00" * 8

            central_directory += file_crc.to_bytes(4, byteorder="little") # CRC
            central_directory += file_size.to_bytes(4, byteorder="little") # compressed size
            central_directory += file_size.to_bytes(4, byteorder="little") # uncompressed size
            central_directory += len(file_name).to_bytes(4, byteorder="little") # filename length

            # file comm len, disk start, internal attr, external attr
            central_directory += b"\x00" * 10

            # offset of local header
            central_directory += local_offset.to_bytes(4, byteorder="little") 
            central_directory += file_name.encode("utf-8") # filename

            entry_count += 1

    cd_offset = len(output_file_content) - 516 # (we reduce signature and RSA size)
    cd_size = len(central_directory)

    eocd = b"\x50\x4B\x05\x06" # signature
    eocd += b"\x00\x00" # disk number
    eocd += b"\x00\x00" # disk on which cd starts
    eocd += entry_count.to_bytes(2, byteorder="little") # disk entry count
    eocd += entry_count.to_bytes(2, byteorder="little") # total entry count
    eocd += cd_size.to_bytes(4, byteorder="little") # cd size
    eocd += cd_offset.to_bytes(4, byteorder="little") # cd offset
    eocd += (32).to_bytes(2, byteorder="little") # comment length

    comment = b"\x58\x5A\x50\x31\x20\x30" # comment (XZP1 0)
    comment += b"\x00" * 26
    comment += b"\x37" # magic number (1 byte) (it doesnt matter)

    comment += b"\x36\x00\x00\x02" # magic number

    output_file_content += central_directory + eocd + comment

    while True:
        try:
            with open("code_harmony.pbin", "wb") as f:
                f.write(output_file_content)
        except PermissionError:
            print("The file is already in use by some program. Close unnecessary programs and try again.")
            input("Press enter to try again... ")
            continue
        break

    return 0

if __name__ == "__main__":
    if len(sys.argv) > 1:
        if sys.argv[1] == "unpack":
            if len(sys.argv) > 2:
                pbin_name = sys.argv[2]
                code = pbin_unpack(pbin_name)

                match code:
                    case 1:
                        print("File doesn't exist.")
                    case 2:
                        print("Invalid pbin file.")

                sys.exit(code)
            else:
                print(f"Usage: {sys.argv[0]} unpack <pbin file>")
                sys.exit(1)

        elif sys.argv[1] == "pack":
            code = pbin_pack()
            sys.exit(code)

        else:
            print(f"Unknown function '{sys.argv[1]}'")
            sys.exit(1)
    else:
        print(f"Usage: {sys.argv[0]} unpack/pack")
        sys.exit(1)