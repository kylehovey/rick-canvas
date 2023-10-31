from PIL import Image
import json

# Open the image
image = Image.open("qr_code.png")

# Convert the image to grayscale
image = image.convert("L")

# Define the size of the QR code (25x25)
qr_code_size = 25

# Initialize a 2D array to store the QR code data
qr_code_data = [[0] * qr_code_size for _ in range(qr_code_size)]

# Calculate the size of each QR code square in the 375x375 image
square_size = image.width // qr_code_size
print(square_size)

# Iterate through the QR code squares and check their color
for i in range(qr_code_size):
    for j in range(qr_code_size):
        # Calculate the coordinates of the current square
        left = j * square_size
        upper = i * square_size
        right = (j + 1) * square_size
        lower = (i + 1) * square_size

        # Extract the pixel data for the current square
        square = image.crop((left, upper, right, lower))
        square_data = list(square.getdata())

        # Check if the square is black (QR code data)
        middle = (square_size // 2)
        if square_data[middle * square_size + middle] < 128:
            qr_code_data[i][j] = 1

# Convert the QR code data to a JSON string
qr_code_json = json.dumps(qr_code_data)

# Print or save the JSON data
print(qr_code_json)

# You can save the JSON data to a file if needed
with open("qr_code_data.json", "w") as json_file:
    json.dump(qr_code_data, json_file, indent=2)
