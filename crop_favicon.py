from PIL import Image
import sys

def trim(image_path):
    try:
        im = Image.open(image_path)
        bg = Image.new(im.mode, im.size, im.getpixel((0,0)))
        diff = Image.difference(im, bg)
        bbox = diff.getbbox()
        if bbox:
            im = im.crop(bbox)
            im.save(image_path)
            print("Cropped successfully")
        else:
            print("No bounding box found, maybe solid color?")
    except Exception as e:
        print(f"Error: {e}")

trim("favicon.png")
