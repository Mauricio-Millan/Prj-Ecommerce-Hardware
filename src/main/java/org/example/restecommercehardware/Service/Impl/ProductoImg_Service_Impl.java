package org.example.restecommercehardware.Service.Impl;

import lombok.RequiredArgsConstructor;
import org.example.restecommercehardware.Mapper.ProductoImg_Entity;
import org.example.restecommercehardware.Mapper.Producto_Entity;
import org.example.restecommercehardware.Repository.ProductoImg_Repository;
import org.example.restecommercehardware.Repository.Producto_Repository;
import org.example.restecommercehardware.Service.FileStorageService;
import org.example.restecommercehardware.Service.ProductoImg_Service;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductoImg_Service_Impl implements ProductoImg_Service {

    private final ProductoImg_Repository productoImgRepository;
    private final Producto_Repository productoRepository;
    private final FileStorageService fileStorageService;

    @Override
    @Transactional(readOnly = true)
    public List<ProductoImg_Entity> getAllProductoImgs() {
        return productoImgRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ProductoImg_Entity> getProductoImgById(Long id) {
        return productoImgRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductoImg_Entity> getImagenesByProducto(Long idProducto) {
        Producto_Entity producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + idProducto));
        return productoImgRepository.findByIdProductoOrderByOrdenAsc(producto);
    }

    @Override
    @Transactional
    public ProductoImg_Entity createProductoImg(Long idProducto, MultipartFile file) {
        // Validar que el producto existe
        Producto_Entity producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + idProducto));

        // Guardar archivo y obtener ruta
        String rutaImagen = fileStorageService.storeFile(file, idProducto);

        // Crear entidad
        ProductoImg_Entity productoImg = new ProductoImg_Entity();
        productoImg.setIdProducto(producto);
        productoImg.setUrlImagen(rutaImagen);

        // Calcular orden (última posición + 1)
        List<ProductoImg_Entity> imagenesExistentes = productoImgRepository.findByIdProductoOrderByOrdenAsc(producto);
        int nuevoOrden = imagenesExistentes.isEmpty() ? 1 :
                imagenesExistentes.get(imagenesExistentes.size() - 1).getOrden() + 1;
        productoImg.setOrden(nuevoOrden);

        return productoImgRepository.save(productoImg);
    }

    @Override
    @Transactional
    public ProductoImg_Entity updateProductoImg(Long id, ProductoImg_Entity productoImgActualizado) {
        ProductoImg_Entity productoImg = productoImgRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Imagen no encontrada con id: " + id));

        if (productoImgActualizado.getOrden() != null) {
            productoImg.setOrden(productoImgActualizado.getOrden());
        }

        return productoImgRepository.save(productoImg);
    }

    @Override
    @Transactional
    public void deleteProductoImg(Long id) {
        ProductoImg_Entity productoImg = productoImgRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Imagen no encontrada con id: " + id));

        // Eliminar archivo físico
        fileStorageService.deleteFile(productoImg.getUrlImagen());

        // Eliminar registro de BD
        productoImgRepository.delete(productoImg);
    }
}
