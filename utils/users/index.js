//DATABASE
const { insertQuery, selectQuery, sequelize } = require("../../db");

async function findUserByName(nombre, apellido) {
	const query = selectQuery("usuarios", "nombre, apellido", `nombre = '${nombre}' AND apellido = '${apellido}'`);
	const [dbUser] = await sequelize.query(query, { raw: true });
	const existingUser = await dbUser.find((element) => element.nombre === nombre && element.apellido === apellido);
	return existingUser ? true : false;
}

async function findUserByUsername(username) {
	const query = selectQuery(
		"usuarios",
		"id_usuario, nombre_usuario, contrasena_usuario, es_admin",
		`nombre_usuario = '${username}'`
	);
	const [dbUser] = await sequelize.query(query, { raw: true });
	const foundUser = dbUser[0];
	return foundUser;
}

async function registrarUsuario(req, res, next) {
	const { nombre_usuario, contrasena_usuario, nombre, apellido, direccion, email, telefono, es_admin } = req.body;
	if (nombre_usuario && contrasena_usuario && nombre && apellido && direccion && email && telefono) {
		try {
			const query = insertQuery(
				"usuarios",
				"nombre_usuario, contrasena_usuario, nombre, apellido, direccion, email, telefono, es_admin",
				[nombre_usuario, contrasena_usuario, nombre, apellido, direccion, email, telefono, es_admin]
			);
			[userId] = await sequelize.query(query, { raw: true });
			req.createdUserId = userId;
			next();
		} catch (err) {
			next(new Error(err));
		}
	} else {
		res.status(400).json("Faltan argumentos");
	}
}

async function validarExisteUsuario(req, res, next) {
	const { nombre, apellido, nombre_usuario } = req.body;
	try {
		const existingUser = await findUserByName(nombre, apellido);
		if (!existingUser) {
			const dbUsers = await findUserByUsername(nombre_usuario);
			if (!dbUsers) {
				next();
			} else {
				res.status(409).json("El nombre de usuario ya existe");
			}
		} else {
			res.status(409).json("El usuario ya existe");
		}
	} catch (err) {
		next(new Error(err));
	}
}

async function getUsuarios(req, res, next) {
	try {
		req.listaUsuarios = await listaUsuarios();
		next();
	} catch (err) {
		next(new Error(err));
	}
}

async function listaUsuarios() {
	const query = selectQuery("usuarios");
	const [dbUsers] = await sequelize.query(query, { raw: true });
	return dbUsers;
}

module.exports = {
	findUserByName,
	findUserByUsername,
	getUsuarios,
	registrarUsuario,
	validarExisteUsuario,
};
