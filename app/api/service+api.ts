import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import FormData from 'form-data';

// Disable Next.js's default body parser to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

const sanitizeFileName = (filename: string) => {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_'); // Replace non-alphanumeric characters with underscores
};

const getFileExtension = (filename: string) => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const businessId = req.query.businessId;
  if (!businessId || typeof businessId !== 'string') {
    return res.status(400).json({ message: 'businessId is missing or invalid' });
  }

  const form = formidable({
    multiples: true,
    maxFileSize: 50 * 1024 * 1024, // Limit file size to 50MB
    uploadDir: './uploads', // Specify a custom upload directory
    keepExtensions: true,   // Keep the original file extension
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error during form parsing:', err);
      return res.status(500).json({ message: 'Error parsing the form' });
    }

    try {
      const formData = new FormData();

      // Append text fields to FormData
      Object.entries(fields).forEach(([key, value]) => {
        const val = Array.isArray(value) ? value[0] : value;
        formData.append(key, val);
      });

      // Handle file uploads
      const uploadedFiles = files.images;
      const imageArray = Array.isArray(uploadedFiles) ? uploadedFiles : uploadedFiles ? [uploadedFiles] : [];

      if (imageArray.length === 0) {
        return res.status(400).json({ message: 'No image provided in the request' });
      }

      // Allowed MIME types for images
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

      // Add image files to FormData
      for (const file of imageArray) {
        if (file && file.filepath) {
          const fileStream = fs.createReadStream(file.filepath);

          const fileExtension = getFileExtension(file.originalFilename || '');
          if (!['.jpeg', '.jpg', '.png', '.gif'].includes(`.${fileExtension}`)) {
            console.warn('Invalid file extension:', fileExtension);
            return res.status(400).json({ message: 'Invalid file type. Only .jpeg, .jpg, .png, and .gif are allowed' });
          }

          if (file.mimetype && allowedMimeTypes.includes(file.mimetype)) {
            formData.append('images', fileStream, sanitizeFileName(file.originalFilename || 'file.jpg'));
          } else {
            console.warn('Invalid or missing file type:', file.mimetype);
          }
        } else {
          console.warn('File is undefined or invalid:', file);
        }
      }

      // Define the backend API URL dynamically
      const API_URL = process.env.API_URL || 'http://localhost:5000';

      // Send the request to the backend API
      const response = await fetch(`${API_URL}/api/business/${businessId}/services`, {
        method: 'POST',
        body: formData as any,
        headers: formData.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Backend API Error:', response.status, data);
        return res.status(response.status).json({ message: 'Error from backend API', error: data.message });
      }

      // Clean up temporary files
      imageArray.forEach((file) => {
        if (file && file.filepath) {
          fs.unlink(file.filepath, (err) => {
            if (err) {
              console.error('Error cleaning up temporary file:', file.filepath, err);
            }
          });
        }
      });

      return res.status(200).json(data);
    } catch (error) {
      console.error('Proxy Error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
}
