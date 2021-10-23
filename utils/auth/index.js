//AUTH
const { JWT, signature } = require("../../auth");

// UTILS
const { findUserByUsername } = require("../users");

function validarAuth(req, res, next) {
	var token = req.headers.authorization;
	token = token.split(" ")[1];
	const validatedUser = JWT.verify(token, signature);
	const { es_admin } = validatedUser;
	if (es_admin) {
		req.es_admin = es_admin;
		next();
	} else {
		res.status(403).json("No tiene permisos");
	}
}

async function validarCredenciales(req, res, next) {
	const { username, password } = req.body;
	try {
		const registeredUser = await findUserByUsername(username);
		if (registeredUser) {
			const { contrasena_usuario: dbPassword, es_admin } = registeredUser;
			console.log(password, dbPassword);
			if (password === dbPassword) {
				const token = JWT.sign({ username, es_admin }, signature, {
					expiresIn: "15m",
				});
				req.jwtToken = token;
				next();
			} else {
				res.status(400).json("Contraseña incorrecta");
			}
		} else {
			res.status(400).json("Nombre de usuario inválido");
		}
	} catch (err) {
		next(new Error(err));
	}
}

module.exports = { validarAuth, validarCredenciales };
