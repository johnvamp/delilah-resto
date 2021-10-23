//LIBS
const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const CORS = require("cors");

//UTILS
const {
	registrarUsuario,
	validarExisteUsuario,
	validarCredenciales,
	validarAuth,
	getProductos,
	getUsuarios,
	crearProducto,
	actualizarProducto,
	borrarProducto,
	crearPedido,
	listarPedidos,
	actualizarEstadoPedido,
	borrarPedido,
} = require("../utils");

//SET UP SERVER
server.listen(3000, () => {
	console.log("Server Started");
});

server.use(bodyParser.json(), CORS());

// USERS ENDPOINTS
server.get("/api/usuarios/", validarAuth, getUsuarios, (req, res) => {
	const { listaUsuarios } = req;
	res.status(200).json(listaUsuarios);
});

server.post("/api/usuarios/", validarExisteUsuario, registrarUsuario, (req, res) => {
	const { createdUserId } = req;
	res.status(201).json({ userId: createdUserId });
});

server.post("/api/usuarios/login", validarCredenciales, (req, res) => {
	const { jwtToken } = req;
	const loginResponse = { token: jwtToken };
	res.status(200).json(loginResponse);
});

// PRODUCTS ENDOPINTS
server.get("/api/productos/", getProductos, (req, res) => {
	const { listaProducto } = req;
	res.status(200).json(listaProducto);
});

server.post("/api/productos/", validarAuth, crearProducto, (req, res) => {
	const { productoAgregado } = req;
	res.status(201).json(productoAgregado);
});

server.put("/api/productos/:idProducto", validarAuth, actualizarProducto, (req, res) => {
	const { productoActualizado } = req;
	res.status(202).json(productoActualizado);
});

server.delete("/api/productos/:idProducto", validarAuth, borrarProducto, (req, res) => {
	const { isDeleted } = req;
	isDeleted && res.status(200).json("Borrado");
});

// ORDERS ENDPOINTS
server.get("/api/pedidos/", validarAuth, listarPedidos, (req, res) => {
	const { listaPedidos } = req;
	res.status(200).json(listaPedidos);
});

server.post("/api/pedidos/", crearPedido, (req, res) => {
	const { pedidoCreado } = req;
	res.status(201).json(pedidoCreado);
});

server.put("/api/pedidos/:idPedido", validarAuth, actualizarEstadoPedido, (req, res) => {
	const { pedidoActualizado } = req;
	res.status(202).json(pedidoActualizado);
});

server.delete("/api/pedidos/:idPedido", validarAuth, borrarPedido, (req, res) => {
	const { borrado } = req;
	borrado && res.status(200).json("Borrado");
});

// ERROR DETECTION
server.use((err, req, res, next) => {
	if (!err) {
		return next();
	} else if (err.name === "JsonWebTokenError") {
		console.log(err);
		res.status(400).json(`Error: ${err.message}`);
	} else if (err.name === "TokenExpiredError") {
		res.status(401).json("Token has expired. Please login again");
	} else {
		console.log("An error has occurred", err), res.status(500).send("Error");
	}
});
