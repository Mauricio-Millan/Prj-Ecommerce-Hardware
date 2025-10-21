use master
go
drop database if exists dbecommercehardware
go
create database  dbecommercehardware
go
use dbecommercehardware
go

-- drop table if exists  usuarios, categorias, marcas, productos, producto_img, pedidos, items_pedido, resenas, carrito, items_carrito
--- Base de Datos para Ecommerce Hardware
CREATE TABLE [usuarios] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [nombre] varchar(50) NOT NULL,
  [apellido] varchar(50),
  [correo_electronico] varchar(100) UNIQUE NOT NULL,
  [hash_contrasena] varchar(255) NOT NULL,
  [numero_telefono] varchar(20),
  [direccion] varchar(255),
  [ciudad] varchar(100),
  [pais] varchar(100),
  [codigo_postal] varchar(10),
  [creado_en] datetime2 DEFAULT (GETDATE()),
  [actualizado_en] datetime2 DEFAULT (GETDATE())
)
GO

CREATE TABLE [categorias] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [nombre] varchar(100) UNIQUE NOT NULL,
  [descripcion] text
)
GO

CREATE TABLE [marcas] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [nombre] varchar(100) UNIQUE NOT NULL
)
GO

CREATE TABLE [productos] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [nombre] nvarchar(255) NOT NULL,
  [descripcion] text,
  [precio] decimal(10,2) NOT NULL,
  [stock] int NOT NULL,
  [sku] varchar(50) UNIQUE,
  [id_categoria] int,
  [id_marca] int,
  [creado_en] datetime2 DEFAULT (GETDATE()),
  [actualizado_en] datetime2 DEFAULT (GETDATE())
)
GO

CREATE TABLE [producto_img] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [id_producto] int,
  [UrlImagen] nvarchar(255),
  [orden] int
)
GO

CREATE TABLE [pedidos] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [id_usuario] int,
  [fecha_pedido] datetime2 DEFAULT (GETDATE()),
  [monto_total] decimal(10,2) NOT NULL,
  [estado] varchar(50) NOT NULL DEFAULT 'pendiente',
  [direccion_envio] varchar(255),
  [ciudad_envio] varchar(100),
  [pais_envio] varchar(100),
  [codigo_postal_envio] varchar(10)
)
GO

CREATE TABLE [items_pedido] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [id_pedido] int,
  [id_producto] int,
  [cantidad] int NOT NULL,
  [precio_unitario] decimal(10,2) NOT NULL
)
GO

CREATE TABLE [resenas] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [id_producto] int,
  [id_usuario] int,
  [calificacion] int NOT NULL DEFAULT (0),
  [comentario] text,
  [creado_en] datetime2 DEFAULT (GETDATE())
)
GO

CREATE TABLE [carrito] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [id_usuario] int,
  [creado_en] datetime2 DEFAULT (GETDATE())
)
GO

CREATE TABLE [items_carrito] (
  [id] int PRIMARY KEY IDENTITY(1, 1),
  [id_carrito] int,
  [id_producto] int,
  [cantidad] int NOT NULL DEFAULT (1)
)
GO

ALTER TABLE [productos] ADD FOREIGN KEY ([id_categoria]) REFERENCES [categorias] ([id])
GO

ALTER TABLE [productos] ADD FOREIGN KEY ([id_marca]) REFERENCES [marcas] ([id])
GO

ALTER TABLE [producto_img] ADD FOREIGN KEY ([id_producto]) REFERENCES [productos] ([id])
GO

ALTER TABLE [pedidos] ADD FOREIGN KEY ([id_usuario]) REFERENCES [usuarios] ([id])
GO

ALTER TABLE [items_pedido] ADD FOREIGN KEY ([id_pedido]) REFERENCES [pedidos] ([id])
GO

ALTER TABLE [items_pedido] ADD FOREIGN KEY ([id_producto]) REFERENCES [productos] ([id])
GO

ALTER TABLE [resenas] ADD FOREIGN KEY ([id_producto]) REFERENCES [productos] ([id])
GO

ALTER TABLE [resenas] ADD FOREIGN KEY ([id_usuario]) REFERENCES [usuarios] ([id])
GO

ALTER TABLE [carrito] ADD FOREIGN KEY ([id_usuario]) REFERENCES [usuarios] ([id])
GO

ALTER TABLE [items_carrito] ADD FOREIGN KEY ([id_carrito]) REFERENCES [carrito] ([id])
GO

ALTER TABLE [items_carrito] ADD FOREIGN KEY ([id_producto]) REFERENCES [productos] ([id])
GO


select * from productos
go

CREATE OR ALTER PROCEDURE ObtenerProductoConImagenPortada
AS
BEGIN
    SELECT
        p.id,
        p.nombre,
        p.descripcion,
        p.precio,
        p.stock,
        p.sku,
        pi.UrlImagen AS imagen_portada,
        m.id AS id_marca,
        m.nombre AS nombre_marca,
        c.id AS id_categoria,
        c.nombre AS nombre_categoria
    FROM productos p
    LEFT JOIN producto_img pi
        ON p.id = pi.id_producto AND pi.orden = 1
    LEFT JOIN marcas m
        ON p.id_marca = m.id
    LEFT JOIN categorias c
        ON p.id_categoria = c.id
END
GO


exec ObtenerProductoConImagenPortada

select * from productos
select * from marcas
select * from categorias