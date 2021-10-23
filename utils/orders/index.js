// DATABASE
const { deleteQuery, insertQuery, joinQuery, selectQuery, sequelize, updateQuery } = require("../../db");

// UTILS
const { findUserByUsername } = require("../users");

const { findProductById, encontrarPrecioProducto } = require("../products");

async function adicionarPedidosEnDB(req, res) {
	const { nombre_usuario, productos, forma_pago } = req.body;
	if (nombre_usuario && productos && forma_pago) {
		const datosUsuario = await findUserByUsername(nombre_usuario);
		if (datosUsuario) {
			const idPedido = datosUsuario.id_usuario;
			const horaPedido = new Date().getTimezoneOffset();
			const [descripcionPedido, subtotal] = await obtenerDescripcionPedidoYPrecio(productos);
			const pedidoAgregado = await registroCrearPedido(horaPedido, descripcionPedido, subtotal, forma_pago, idPedido);
			await relacionCrearPedido(pedidoAgregado, productos);
			return await mostrarInfoPedido(pedidoAgregado);
		} else {
			res.status(400).json("User not found");
		}
	} else {
		res.status(405).json("Missing Arguments");
	}
}

async function descripcionCompleta(infoPedido) {
	const pedido = infoPedido[0];
	const consultaProductos = joinQuery(
		"pedidos_productos",
		"pedidos_productos.cantidad_producto, productos.*",
		[`productos ON pedidos_productos.id_producto = productos.id_producto`],
		`id_pedido = ${pedido.id_pedido}`
	);
	const [productsInfo] = await sequelize.query(consultaProductos, {
		raw: true,
	});
	pedido.products = await productsInfo;
	return pedido;
}

async function crearPedido(req, res, next) {
	try {
		req.pedidoCreado = await adicionarPedidosEnDB(req, res);
		next();
	} catch (err) {
		next(new Error(err));
	}
}

async function registroCrearPedido(tiempo_pedido, descripcionPedido, precioTotal, formaPago, usuario) {
	const query = insertQuery("pedidos", "tiempo_pedido, descripcion_pedido, cantidad_pedido, forma_pago, id_usuario", [
		tiempo_pedido,
		descripcionPedido,
		precioTotal,
		formaPago,
		usuario,
	]);
	const [registroAgregado] = await sequelize.query(query, { raw: true });
	return registroAgregado;
}

async function relacionCrearPedido(idPedido, productos) {
	productos.forEach(async (producto) => {
		const { idProducto, cantidad } = producto;
		const query = insertQuery("pedidos_productos", "id_pedido, id_producto, cantidad_producto", [
			idPedido,
			idProducto,
			cantidad,
		]);
		await sequelize.query(query, { raw: true });
	});
	return true;
}

async function borrarPedido(req, res, next) {
	const id = +req.params.idPedido;
	console.log(id);
	try {
		const pedidoABorrar = await buscarPedidoPorId(id);
		if (pedidoABorrar) {
			const query = deleteQuery("pedidos", `id_pedido = ${id}`);
			await sequelize.query(query, { raw: true });
			req.borrado = true;
			next();
		} else {
			res.status(404).json("Pedido no encontrado");
		}
	} catch (err) {
		next(new Error(err));
	}
}

async function buscarPedidoPorId(idPedido) {
	const query = selectQuery("pedidos", "*", `id_pedido = ${idPedido}`);
	const [dbOrder] = await sequelize.query(query, { raw: true });
	const foundOrder = await dbOrder.find((element) => element.id_pedido === idPedido);
	return foundOrder;
}

async function listarPedidos(req, res, next) {
	try {
		const consultaPedidos = selectQuery("pedidos", "id_pedido");
		const [idPedido] = await sequelize.query(consultaPedidos, { raw: true });
		const detallePedidos = async () => {
			return Promise.all(idPedido.map(async (pedido) => mostrarInfoPedido(pedido.id_pedido)));
		};
		req.listaPedidos = await detallePedidos();
		next();
	} catch (err) {
		next(new Error(err));
	}
}

async function obtenerDescripcionPedidoYPrecio(productos) {
	let descripcionPedido = "";
	let subtotal = 0;
	for (let i = 0; i < productos.length; i++) {
		descripcionPedido = descripcionPedido + (await mostrarNombreDescripcion(productos[i]));
		subtotal = +subtotal + +(await encontrarPrecioProducto(productos[i]));
	}
	return [descripcionPedido, subtotal];
}

async function mostrarNombreDescripcion(producto) {
	const { idProducto, cantidad } = producto;
	const nombreProducto = (await findProductById(idProducto)).nombre_producto;
	const descripcionProducto = `${cantidad}x${nombreProducto.slice(0, 5)} `;
	return descripcionProducto;
}

async function mostrarInfoPedido(idPedido) {
	const consultaPedido = joinQuery(
		"pedidos",
		"pedidos.*, usuarios.nombre_usuario, usuarios.nombre, usuarios.apellido,usuarios.direccion, usuarios.email, usuarios.telefono",
		["usuarios ON pedidos.id_usuario = usuarios.id_usuario"],
		`id_pedido = ${idPedido}`
	);
	const [infoPedido] = await sequelize.query(consultaPedido, { raw: true });
	return descripcionCompleta(infoPedido);
}

async function actualizarEstadoPedido(req, res, next) {
	const id = +req.params.idPedido;
	const { estado } = req.body;
	const estadoValido = validarEstado(estado);
	console.log(id, estado, estadoValido);
	if (estadoValido) {
		try {
			const pedodidoAActualizar = await buscarPedidoPorId(id);
			if (pedodidoAActualizar) {
				const query = updateQuery("pedidos", `estado_pedido = '${estado}'`, `id_pedido = ${id}`);
				await sequelize.query(query, { raw: true });
				req.pedidoActualizado = await buscarPedidoPorId(id);
			} else {
				res.status(404).json("Pedido no encontrado");
			}
			next();
		} catch (err) {
			next(new Error(err));
		}
	} else {
		res.status(405).json("Estado inválido");
	}
}

function validarEstado(estadoActual) {
	const estadosValidos = ["nueva", "confirmada", "preparando", "entregando", "entregado"];
	const estadoExistente = estadosValidos.find((estado) => estado === estadoActual);
	return estadoExistente;
}

module.exports = {
	descripcionCompleta,
	crearPedido,
	borrarPedido,
	listarPedidos,
	actualizarEstadoPedido,
};
