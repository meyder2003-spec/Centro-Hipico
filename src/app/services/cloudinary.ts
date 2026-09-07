import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private cloudName = 'dwp2cppuu'; 
  private uploadPreset = 'CENTRO_HIPICO';

  async subirArchivo(file: File): Promise<string> {
    const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/auto/upload`;
    const formData = new FormData();

    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    // Nota: La carpeta 'CHM' se asigna automáticamente mediante el preset en Cloudinary

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Detalle del error Cloudinary:', errorData);
        throw new Error('Error al subir el archivo a Cloudinary');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error Cloudinary Upload:', error);
      throw error;
    }
  } 
}