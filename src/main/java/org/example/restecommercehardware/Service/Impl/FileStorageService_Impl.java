package org.example.restecommercehardware.Service.Impl;

import org.example.restecommercehardware.Service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService_Impl implements FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Value("${file.allowed-extensions}")
    private String allowedExtensions;

    @Value("${app.base-url}")
    private String baseUrl;

    @Override
    public String storeFile(MultipartFile file, Long idProducto) {
        try {
            // Validar archivo
            if (!isValidImageFile(file)) {
                throw new RuntimeException("Tipo de archivo no permitido");
            }

            // Obtener ruta absoluta del directorio del proyecto
            String projectPath = System.getProperty("user.dir");
            Path uploadPath = Paths.get(projectPath, uploadDir);

            // Crear directorio si no existe
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generar nombre único
            String originalFileName = file.getOriginalFilename();
            String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            String newFileName = "producto_" + idProducto + "_" + UUID.randomUUID() + fileExtension;

            // Guardar archivo
            Path targetLocation = uploadPath.resolve(newFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Retornar ruta relativa
            return "/uploads/" + newFileName;

        } catch (IOException e) {
            throw new RuntimeException("Error al guardar el archivo: " + e.getMessage());
        }
    }

    @Override
    public void deleteFile(String rutaImagen) {
        try {
            // Extraer nombre del archivo de la ruta
            String fileName = rutaImagen.substring(rutaImagen.lastIndexOf("/") + 1);

            // Obtener ruta absoluta del proyecto
            String projectPath = System.getProperty("user.dir");
            Path filePath = Paths.get(projectPath, uploadDir, fileName);

            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Error al eliminar el archivo: " + e.getMessage());
        }
    }

    @Override
    public boolean isValidImageFile(MultipartFile file) {
        if (file.isEmpty()) {
            return false;
        }

        String fileName = file.getOriginalFilename();
        if (fileName == null) {
            return false;
        }

        String extension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
        List<String> allowedExts = Arrays.asList(allowedExtensions.split(","));

        return allowedExts.contains(extension);
    }

    public String getFullUrl(String rutaImagen) {
        return baseUrl + rutaImagen;
    }
}
