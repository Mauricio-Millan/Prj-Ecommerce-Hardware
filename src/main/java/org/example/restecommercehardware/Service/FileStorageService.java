package org.example.restecommercehardware.Service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String storeFile(MultipartFile file, Long idProducto);
    void deleteFile(String fileName);
    boolean isValidImageFile(MultipartFile file);
}
