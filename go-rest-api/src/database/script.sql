create table PRODUCTO(
	id SERIAL PRIMARY KEY,
	nombre varchar(200),
	precio float
)

CREATE TABLE CLIENTAS (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200),
    apellido VARCHAR(200)
);


CREATE TABLE PEDIDO2 (
    id SERIAL PRIMARY KEY,
    fecha DATE,
    clientaId INT,
    total FLOAT,
    notas VARCHAR(300),
    CONSTRAINT pedidoClientaIdfk FOREIGN KEY (clientaId) REFERENCES CLIENTAS(id)
);

CREATE TABLE PEDIDO_DETALLE (
    id SERIAL PRIMARY KEY,
    pedidoId INT,
    productoId INT,
    cantidad INT,
    subtotal FLOAT,
    CONSTRAINT pedidoDetallePedidoIdfk FOREIGN KEY (pedidoId) REFERENCES PEDIDO2(id),
    CONSTRAINT pedidoDetalleProductoIdfk FOREIGN KEY (productoId) REFERENCES PRODUCTO(id)
);

CREATE TABLE DEVOLUCION2 (
    id SERIAL PRIMARY KEY,
    fecha DATE,
    clientaId INT,
    total FLOAT,
    notas VARCHAR(300),
    CONSTRAINT devolucionClientaIdfk FOREIGN KEY (clientaId) REFERENCES CLIENTAS(id)
);

CREATE TABLE DEVOLUCION_DETALLE (
    id SERIAL PRIMARY KEY,
    devolucionId INT,
    productoId INT,
    cantidad INT,
    subtotal FLOAT,
    CONSTRAINT devolucionDetalleDevolucionIdfk FOREIGN KEY (devolucionId) REFERENCES DEVOLUCION2(id),
    CONSTRAINT devolucionDetalleProductoIdfk FOREIGN KEY (productoId) REFERENCES PRODUCTO(id)
);


create table ACCIONES(
	id SERIAL PRIMARY KEY,
	verDevoluciones
)

create table ABONOS2(
	id SERIAL PRIMARY KEY,
	fecha DATE,
	monto FLOAT,
	comentarios VARCHAR(500),
	pedidoId INT,
	CONSTRAINT abonopedidoIdfk FOREIGN KEY (pedidoId) REFERENCES PEDIDO2(id)
)

