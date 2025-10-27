# Sample Images for Testing

You can now use these filenames in your paquete forms:

## Available Images:
- `bariloche.jpg` - Already exists
- `iguazu.jpg` - Already exists  
- `rio_de_janeiro.jpg` - Already exists

## How to add more images:
1. Copy your image files to this `public` folder
2. Use just the filename (like `italy.jpg`) in the paquete form
3. The backend will automatically create the full URL: `http://localhost:3001/images/italy.jpg`

## Backend Configuration:
- Images are stored in: `/backend/public/` folder
- Images are served at: `http://localhost:3001/images/filename.jpg`
- Static file mapping: `/images/` URL path → `public` folder

## Supported formats:
- JPG/JPEG
- PNG  
- GIF
- WEBP

## Example usage:
When creating a paquete, in the "Foto" field, just type:
- `bariloche.jpg`
- `iguazu.jpg`
- `rio_de_janeiro.jpg`

The backend will automatically save the full URL in the database as:
- `http://localhost:3001/images/bariloche.jpg`
- `http://localhost:3001/images/iguazu.jpg`
- `http://localhost:3001/images/rio_de_janeiro.jpg`