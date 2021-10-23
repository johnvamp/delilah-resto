const { findUserByName, findUserByUsername, getUsuarios, registrarUsuario, validarExisteUsuario } = require("./users");

const { validarAuth, validarCredenciales } = require("./auth");

const {
	applyProductChanges,
	crearProducto,
	borrarProducto,
	findProductById,
	findProductPrice,
	getProductos,
	newProduct,
	actualizarProducto,
	actualizarProductoInDb,
} = require("./products");

const { completeDesc, crearPedido, borrarPedido, listarPedidos, actualizarEstadoPedido } = require("./orders");

module.exports = {
	applyProductChanges,
	crearPedido,
	crearProducto,
	completeDesc,
	borrarProducto,
	borrarPedido,
	findProductById,
	findProductPrice,
	findUserByName,
	findUserByUsername,
	getProductos,
	getUsuarios,
	listarPedidos,
	newProduct,
	registrarUsuario,
	actualizarEstadoPedido,
	actualizarProducto,
	actualizarProductoInDb,
	validarAuth,
	validarCredenciales,
	validarExisteUsuario,
};
