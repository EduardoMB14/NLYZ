//-------LIBRERIAS Y CONFIGURACION DE CARPETAS---------//

//- invocamos a express
const express = require('express');
const app = express ();

//Invocamos a Multer
const multer = require('multer');
const fs = require('fs');

//invocamos a nodemailer
//const nodemailer = require('nodemailer')

//-Invocamos a dotenv
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});

// - Invocamos el modulo de conexion de la BD
const connection = require('./Database/db');
const { get } = require('https');

// - Motor de plantillas
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

// - Invocar a bcryptjs
const bcryptjs = require('bcryptjs');

// - sesion var
const sesion = require('express-session');
const { ifError } = require('assert');
const { register } = require('module');
app.use(sesion({
    secret: 'secret',
    resave: true, 
    saveUninitialized: true
}));

// - seteamos urlencoded para capturar los datos del formulario
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// -configurar el directorio public para procesamiento de imagenes, css y fuentes
app.use('/resources', express.static('Public'));
app.use('/resources', express.static(__dirname + '/Public'));

// -configurar el directorio scripts para procesamiento de archivos y funcionamiento frontend
app.use('/scripts', express.static('js'));
app.use('/scripts', express.static(__dirname + '/scripts'));

// -configurar el directorio uploads para procesamiento de imagenes, para las areas
app.use('/source', express.static('IMG_Products'));
app.use('/source', express.static(__dirname + '/IMG_Products'));

// Directorio de Multer /IMG_Products 
const upload = multer({ dest: 'IMG_Products/' }); // Directorio donde se guardarán temporalmente los archivos


// Middleware de autenticación
function checkAuthenticated(req, res, next) {
    if (req.session.loggedin) {
        next();
    } else {
        res.redirect('/login');
    }
}

//-------CIERRE DE LIBRERIAS Y CONFIGURACION DE CARPETAS---------//


// ALERTAS //
// Función para renderizar el mensaje de alerta
function renderAlert(req, res, page, title, message, icon, showConfirmButton, timer, ruta) {
    if (req.session) {
        res.render(page, {
            login: true,
            name: req.session.name,
            email: req.session.email,
            user: req.session.user,
            alert: true,
            alertTitle: title,
            alertMessage: message,
            alertIcon: icon,
            showConfirmButton: showConfirmButton,
            timer: timer,
            ruta: ruta
        });
    } else {
        res.render(page, {
            alert: true,
            alertTitle: title,
            alertMessage: message,
            alertIcon: icon,
            showConfirmButton: showConfirmButton,
            timer: timer,
            ruta: ruta
        });
    }
}
//___________________//

//__________________________RUTAS DE ACCESO_______________________//
//login
app.get('/login', (req, res)=>{
    res.render('login');
});

//Registrarse
app.get('/registrarse', (req, res)=>{
    res.render('register');
});

//Registrarse
app.get('/car', (req, res)=>{
    res.render('car');
});


//Raiz 
app.get('/', checkAuthenticated, (req, res)=>{
    res.render('index', {
        login: true,
        name: req.session.name,
        email: req.session.email,
        user: req.session.user
    });
});

// Playeras
app.get('/Playeras', checkAuthenticated, (req, res) => {
    res.render('t_shirts', {
        login: true,
        name: req.session.name,
        email: req.session.email,
        user: req.session.user
    });
});

// Pantalones
app.get('/Pantalones', checkAuthenticated, (req, res) => {
    res.render('jeans', {
        login: true,
        name: req.session.name,
        email: req.session.email,
        user: req.session.user
    });
});

// Ropa interior
app.get('/Ropa-interior', checkAuthenticated, (req, res) => {
    res.render('underwear', {
        login: true,
        name: req.session.name,
        email: req.session.email,
        user: req.session.user
    });
});

// Calzado
app.get('/Calzado', checkAuthenticated, (req, res) => {
    res.render('shoes', {
        login: true,
        name: req.session.name,
        email: req.session.email,
        user: req.session.user
    });
});

// Carrito
app.get('/Carrito-de-compras', checkAuthenticated, (req, res) => {
    res.render('cart', {
        login: true,
        name: req.session.name,
        email: req.session.email,
        user: req.session.user
    });
});

// Más información
app.get('/Sobre-nosotros', checkAuthenticated, (req, res) => {
    res.render('more_info', {
        login: true,
        name: req.session.name,
        email: req.session.email,
        user: req.session.user
    });
});

// Contacto
app.get('/Contacto', checkAuthenticated, (req, res) => {
    res.render('contact', {
        login: true,
        name: req.session.name,
        email: req.session.email,
        user: req.session.user
    });
});



//Agregar productos
app.get('/Agregar_productos', checkAuthenticated, (req, res) => {
    if (req.session.user == "Admin"){
        res.render('add_products', {
            login: true,
            name: req.session.name,
            email: req.session.email,
            user: req.session.user
        });
    }else{
        res.render('index', {
            login: true,
            name: req.session.name,
            email: req.session.email,
            user: req.session.user
        });
    }
});


//Eliminar productos
app.get('/Eliminar_productos', checkAuthenticated, (req, res) => {
    if (req.session.user == "Admin"){
        res.render('add_products', {
            login: true,
            name: req.session.name,
            email: req.session.email,
            user: req.session.user
        });
    }else{
        res.render('index', {
            login: true,
            name: req.session.name,
            email: req.session.email,
            user: req.session.user
        });
    }
});

//Actualizar productos
app.get('/Actualizar_productos', checkAuthenticated, (req, res) => {
    if (req.session.user == "Admin"){
        res.render('add_products', {
            login: true,
            name: req.session.name,
            email: req.session.email,
            user: req.session.user
        });
    }else{
        res.render('index', {
            login: true,
            name: req.session.name,
            email: req.session.email,
            user: req.session.user
        });
    }
});

//_______________________________________________________________________//


/*--------     Obtener los productos por categorias    -------------*/
//Obtener productos -generales
app.get('/Obtener_productos', (req, res) =>{
    const query = `
    SELECT * 
    FROM productos 
    WHERE cantidad >= 1 
    `;

    connection.query(query, (error, products) => {
        if (error) {
          console.error('Error en la consulta: ', error);
          renderAlert(req, res, 'index', "Error", "! ERROR INTERNO EN EL SERVIDOR ¡", 'error', true, false, '');
        } else {
        //console.log(products);
          res.json(products);
        }
      });
});

const query_type = `SELECT * FROM productos WHERE cantidad >= 1 AND tipo = ? `;

//Obtener productos -Calzado
app.get('/get_shoes', (req, res) => {
    
    const tipo = 'shoes';

    connection.query(query_type, [tipo], (error, products) => {
        if (error) {
          console.error('Error en la consulta: ', error);
          renderAlert(req, res, 'shoes', "Error", "! ERROR INTERNO EN EL SERVIDOR ¡", 'error', true, false, 'Calzado');
        } else {
          res.json(products);
        }
    });
});

//Obtener productos -Pantalones
app.get('/get_jeans', (req, res) =>{
    const tipo = 'jeans';

    connection.query(query_type, [tipo], (error, products) => {
        if (error) {
          console.error('Error en la consulta: ', error);
          renderAlert(req, res, 'jeans', "Error", "! ERROR INTERNO EN EL SERVIDOR ¡", 'error', true, false, 'Pantalones');
        } else {
            //console.log(products);
          res.json(products);
        }
      });
});

//Obtener productos -Ropa Interior
app.get('/get_underwear', (req, res) =>{

    const tipo = 'underwear';

    connection.query(query_type, [tipo], (error, products) => {
        if (error) {
          console.error('Error en la consulta: ', error);
          renderAlert(req, res, 'underwear', "Error", "! ERROR INTERNO EN EL SERVIDOR ¡", 'error', true, false, 'Ropa-interior');
        } else {
            //console.log(products);
          res.json(products);
        }
      });
});

//Obtener productos -Playeras
app.get('/get_t_shirts', (req, res) =>{
    const tipo = 't_shirts';

    connection.query(query_type, [tipo], (error, products) => {
        if (error) {
          console.error('Error en la consulta: ', error);
          renderAlert(req, res, 't_shirts', "Error", "! ERROR INTERNO EN EL SERVIDOR ¡", 'error', true, false, 'Playeras');
        } else {
            //console.log(products);
          res.json(products);
        }
      });
});

//_______________________________________________________________________//

// Registrarse
app.post('/register_form', async (req, res) => {
    const Nombre = req.body.nom;
    const Email = req.body.email;
    const Password = req.body.pass;
    const Rol = 'user';

    // Validar información
    if (Nombre && Email && Password) {
        // Verificar que el correo no haya sido usado antes
        connection.query('SELECT * FROM login WHERE Correo = ?', [Email], async (error, results) => {
            if (error) {
                console.log(error);
                // Renderizar página con mensaje de error
                renderAlert(req, res, 'register', "Error", "Error en la base de datos", 'error', true, false, "registrarse");
            } else {
                if (results.length > 0) {
                    // El correo electrónico ya está en uso
                    renderAlert(req, res, 'register', "Error", "El correo electrónico ya se encuentra en uso", 'warning', true, false, "registrarse");
                } else {
                    // Hacer el registro
                    let passwordHash = await bcryptjs.hash(Password, 8);
                    connection.query('INSERT INTO login SET ?', { Nombre: Nombre, Correo: Email, Contrasena: passwordHash, Rol: Rol }, async (error, results) => {
                        if (error) {
                            console.log(error);
                            // Renderizar página con mensaje de error
                            renderAlert(req, res, 'register', "Error", "Error en la base de datos", 'error', true, false, "registrarse");
                        } else {
                            // Renderizar página con mensaje de éxito
                            renderAlert(req, res, 'register', "Registro", "Registro exitoso", 'success', false, 1500, "login");
                        }
                    });
                }
            }
        });
    }
});

//  - Autenticación
app.post('/auth', async (req, res) => {
    const user = req.body.email;
    const Password = req.body.pass;

    if (user && Password) {
        connection.query('SELECT * FROM login WHERE Correo = ?', [user], async (error, results) => {
            if (error) {
                console.log(error);
                // Renderizar página con mensaje de error
                renderAlert(req, res, 'login', "Error", "Error en la base de datos", 'error', true, false, "login");
            } else {
                if (results.length === 0 || !(await bcryptjs.compare(Password, results[0].Contrasena))) {
                    renderAlert(req, res, 'login', "Error", "Correo y/o contraseña incorrectas", 'error', true, false, 'login');
                } else {
                    req.session.loggedin = true;
                    req.session.user = results[0].Rol;
                    req.session.name = results[0].Nombre;
                    req.session.email = user; // Almacena el correo electrónico en la sesión
                    renderAlert(req, res, 'login', "", "", 'success', false, 1000, '');
                }
            }
        });
    } else {
        renderAlert(req, res, 'login', "Advertencia", "! Por favor ingrese un usuario y/o contraseña ¡", 'warning', true, false, 'login');
    }
});








// Middleware para manejar rutas no encontradas para páginas
app.use((req, res, next) => {
    // Verificar si la ruta es para una página
    if (req.accepts('html')) {
        res.status(404).render('404'); // Renderizar la página 404
    } else {
        // Si no es una página, pasar al siguiente middleware
        next();
    }
});

// Middleware para manejar rutas no encontradas para otros elementos (como API)
app.use((req, res) => {
    // Aquí puedes manejar rutas no encontradas para otros elementos, como APIs
    res.status(404).json({ error: 'Ruta no encontrada' });
});

//Escuchar la app en el puerto 3000
app.listen(3000,(req, res)=> {
    console.log('SERVER US RUNNING IN http://localhost:3000');
})
