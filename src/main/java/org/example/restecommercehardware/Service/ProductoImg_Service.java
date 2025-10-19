package org.example.restecommercehardware.Service;

import org.example.restecommercehardware.Mapper.ProductoImg_Entity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface ProductoImg_Service {
    List<ProductoImg_Entity> getAllProductoImgs();
    Optional<ProductoImg_Entity> getProductoImgById(Long id);
    List<ProductoImg_Entity> getImagenesByProducto(Long idProducto);
    ProductoImg_Entity createProductoImg(Long idProducto, MultipartFile file);
    ProductoImg_Entity updateProductoImg(Long id, ProductoImg_Entity productoImg);
    void deleteProductoImg(Long id);
}
