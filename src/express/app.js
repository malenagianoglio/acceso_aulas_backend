const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 

const routes = {
	usuarios: require('./routes/usuarios'),
	espacios: require('./routes/espacios'),
	permisoAcceso: require('./routes/permisoAcceso'),
	comprobarAcceso: require('./routes/comprobarAcceso'),
	historialAcceso: require('./routes/historialAcceso')
};

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function makeHandlerAwareOfAsyncErrors(handler) {
	return async function(req, res, next) {
		try {
			await handler(req, res);
		} catch (error) {
			next(error);
		}
	};
}

for (const [routeName, routeController] of Object.entries(routes)) {
	if (routeController.getAll) {
		app.get(
			`/api/${routeName}`,
			makeHandlerAwareOfAsyncErrors(routeController.getAll)
		);
	}
	if (routeController.getById) {
		app.get(
			`/api/${routeName}/:id`,
			makeHandlerAwareOfAsyncErrors(routeController.getById)
		);
	}
	if (routeController.create) {
		app.post(
			`/api/${routeName}`,
			makeHandlerAwareOfAsyncErrors(routeController.create)
		);
	}
	if (routeController.update) {
		app.put(
			`/api/${routeName}/:id`,
			makeHandlerAwareOfAsyncErrors(routeController.update)
		);
	}
	if (routeController.remove) {
		app.delete(
			`/api/${routeName}/:id`,
			makeHandlerAwareOfAsyncErrors(routeController.remove)
		);
	}
}

app.post('/api/comprobarAcceso', 
	makeHandlerAwareOfAsyncErrors(routes.comprobarAcceso.checkAccess)
);

app.get('/api/buscarPermisos',
	makeHandlerAwareOfAsyncErrors(routes.permisoAcceso.buscarPermisos)
)

module.exports = app;