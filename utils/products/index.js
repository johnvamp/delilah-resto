//DATABASE
const { deleteQuery, insertQuery, selectQuery, sequelize, updateQuery } = require("../../db");

async function aplicarCambiosProducto(productoAActualizar, propiedadesActualizadas) {
	const propiedades = Object.keys(propiedadesActualizadas).filter(
		(propiedad) =>
			propiedadesActualizadas[propiedad] &&
			propiedadesActualizadas[propiedad] !== " " &&
			propiedadesActualizadas[propiedad] !== "null" &&
			propiedadesActualizadas[propiedad] !== "undefined" &&
			!propiedadesActualizadas[propiedad].toString().includes("  ")
	);
	nuevasPropiedades = propiedades.reduce((obj, propiedad) => {
		obj[propiedad] = propiedadesActualizadas[propiedad];
		return obj;
	}, {});
	const productoActualizado = { ...productoAActualizar, ...nuevasPropiedades };
	return productoActualizado;
}

async function crearProducto(req, res, next) {
	const { nombre_producto, foto_producto, precio_producto } = req.body;
	if (nombre_producto && foto_producto && precio_producto >= 0) {
		try {
			const createdProduct = await productoNuevo(nombre_producto, foto_producto, precio_producto);
			req.addedProduct = { idProducto: await createdProduct };
			next();
		} catch (err) {
			next(new Error(err));
		}
	} else {
		res.status(400).json("Missing Arguments");
	}
}

async function borrarProducto(req, res, next) {
	const id = +req.params.idProducto;
	try {
		const productoABorrar = await findProductById(id);
		if (productoABorrar) {
			const existePedido = await existePedidoConProducto(id);
			if (!existePedido) {
				const estaBorrado = async () => {
					const query = deleteQuery("productos", `id_producto = ${id}`);
					await sequelize.query(query, { raw: true });
					return true;
				};
				req.isDeleted = await estaBorrado();
				next();
			} else {
				res
					.status(409)
					.json("Producto relacionado con un pedido activo. Por favor resuelva el conflicto e intente otra vez");
			}
		} else {
			res.status(404).json("Producto no encontrado");
		}
	} catch (err) {
		next(new Error(err));
	}
}

async function existePedidoConProducto(idProducto) {
	const query = selectQuery("pedidos_productos", "*", `id_producto = ${idProducto}`);
	const [results] = await sequelize.query(query, { raw: true });
	if (results.length) {
		return true;
	} else {
		return false;
	}
}

async function findProductById(id) {
	const query = selectQuery("productos", "*", `id_producto = ${id}`);
	const [dbProduct] = await sequelize.query(query, { raw: true });
	const foundProduct = await dbProduct.find((element) => element.id_producto === id);
	return foundProduct;
}

async function encontrarPrecioProducto(producto) {
	const { idProducto, cantidad } = producto;
	const precioProducto = (await findProductById(idProducto)).precio_producto;
	const subtotal = `${+precioProducto * +cantidad}`;
	return subtotal;
}

async function getProductos(req, res, next) {
	try {
		req.listaProducto = await listaProductos();
		next();
	} catch (err) {
		next(new Error(err));
	}
}

async function productoNuevo(nombre_producto, foto_producto, precio_producto) {
	const query = insertQuery("productos", "nombre_producto, foto_producto, precio_producto", [
		nombre_producto,
		foto_producto,
		precio_producto,
	]);
	const [addedProduct] = await sequelize.query(query, { raw: true });
	return addedProduct;
}

async function listaProductos() {
	const query = selectQuery("productos");
	const [dbProducts] = await sequelize.query(query, { raw: true });
	return dbProducts;
}

async function actualizarProducto(req, res, next) {
	const id = +req.params.idProducto;
	const propiedadesActualizadas = req.body;
	try {
		const productoAActualizar = await findProductById(id);
		if (productoAActualizar) {
			const productoActualizado = await aplicarCambiosProducto(productoAActualizar, propiedadesActualizadas);
			const productoGuardado = await actualizarProductoEnDb(id, productoActualizado);
			req.productoActualizado = productoGuardado;
			next();
		} else {
			res.status(404).json("Producto no encontrado");
		}
	} catch (err) {
		next(new Error(err));
	}
}

async function actualizarProductoEnDb(id, product) {
	const { nombre_producto, foto_producto, precio_producto } = product;
	const query = updateQuery(
		"productos",
		`nombre_producto = '${nombre_producto}', foto_producto = '${foto_producto}', precio_producto = '${precio_producto}'`,
		`id_producto = ${id}`
	);
	await sequelize.query(query, { raw: true });
	const dbProduct = await findProductById(id);
	return dbProduct;
}

module.exports = {
	aplicarCambiosProducto,
	crearProducto,
	borrarProducto,
	findProductById,
	encontrarPrecioProducto,
	getProductos,
	productoNuevo,
	actualizarProducto,
	actualizarProductoEnDb,
};
