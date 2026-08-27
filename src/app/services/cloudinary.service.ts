import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private cloudName = 'dwp2cppuu'; 
  private uploadPreset = 'atph4bxq'; 

 async subirImagen(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    // Usa 'auto' para que determine automáticamente si es imagen o documento/PDF
    const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/auto/upload`;

    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Error al subir el archivo');
    }

    const data = await response.json();
    return data.secure_url;
  }
}