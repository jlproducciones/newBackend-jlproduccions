let sendMailFunction;

import("./sendEmail/sendEmail.js")
  .then(module => {
    sendMailFunction = module.sendMailFunction;
  })
  .catch(error => {
    console.error("Error al cargar el módulo sendEmail:", error);
  });
const express = require("express")
const mysql = require("mysql")
const cors = require("cors")
const app = express();
const port = 4000;

const corsOptions = {
    origin: ['https://jlproducciones.github.io', 'https://jlproducciones.github.io/administrador'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
};



  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true })); 

app.listen(port, () => {
    console.log("base de datos jlproduccions conected")
})


app.get("/", (req, res) => {
    res.send("Servidor jlProduccions funcionando")
})


const connection = mysql.createConnection({
    host: "brbepiladuxmexzmujyr-mysql.services.clever-cloud.com",
    user: "uc3svp3nb0xpwk2q",
    password: "iqdscD6gQeGu8OgHueme",
    database: "brbepiladuxmexzmujyr",
    port: 3306
  });



// Establecer la conexión
connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión a la base de datos establecida');
});




app.get("/", (req, res) => {
    res.send("Servidor jlProduccions funcionando");
});





// Enviar reseñas al frontend
app.get("/getResena", (req, res) => {
    const sql = "SELECT * FROM resenas";

    // Ejecutar la consulta SQL
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            res.status(500).json({ error: 'Error al obtener las reseñas' });
            return;
        }
        res.json(results); // Enviar los resultados como respuesta en formato JSON
    });
});



// TRAER RESEÑAS DEL FRONTEND Y ENVIAR A LA BASE DE DATOS

app.post('/postResena', (req, res) => {
    const { name, resena, likes } = req.body;
    
    // Insertar la reseña en la base de datos
    const sql = `INSERT INTO resenas (name, resena, likes) VALUES (?, ?, ?)`;
 connection.query(sql, [name, resena, likes], (err, result) => {
      if (err) {
        console.error('Error al insertar la reseña:', err);
        res.status(500).send('Error al insertar la reseña');
      } else {
        console.log('Reseña añadida con éxito');
        res.status(200).send('Reseña añadida con éxito');
      }
    });
  });
  
 

  // TRAER LIKES DEL FRONTEND Y ENVIAR A LA BASE DE DATOS

  app.post('/postLikeResena', (req, res) => {
    // Incrementar el número de likes en 1 para todas las reseñas (o para una reseña específica si es necesario)
    const sql = `UPDATE resenas SET likes = likes + 1`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error al incrementar el número de likes:', err);
            res.status(500).send('Error al incrementar el número de likes');
        } else {
            console.log('Número de likes incrementado con éxito');
            res.status(200).send('Número de likes incrementado con éxito');
        }
    });
});


  // ENVIAR BANDAS A LA BASE DE DATOS

  app.post('/sendBands', (req, res) => {
   const {name, gender, leach, number, email, date, time} = req.body
   const sql = "INSERT INTO bands (name, gender, leach, number, email, date, time)  VALUES( ?, ?, ?, ?, ?, ?, ?)"
  connection.query(sql, [name, gender, leach, number, email, date, time], (err, result) => {
if(err){
    console.log("Erro al enviar la banda")
    res.status(500).send("Error al enviar nueva banda")
}
else{
    console.log("Nueva banda añadida con exito")
    res.status(200).send("nueva banda añadida con exito")
}
  })  


})


// ENVIAR BANDAS AL FRONTEND

app.get("/getBands", (req, res) => {
sql = "SELECT * FROM bands"
connection.query(sql, (err, result) => {
    if(err){
        console.log("Error al traer las bandas ", err),
        res.status(500).json({error: "Error al traer las bandas del backend "})
    }else {
        console.log("Bandas traidas con exito")
        res.status(200).json(result)
    }
})

})


// REGISTROS



app.post("/sendRegisterBand", (req, res) => {
    const { id, date, time, hour } = req.body;
    const sqlSelect = "SELECT date, time, hour FROM bands WHERE id = ?";
    const sqlUpdate = "UPDATE bands SET date = CONCAT(date, ?), time = CONCAT(time, ?), hour = CONCAT(hour, ?) WHERE id = ?";
  
    connection.query(sqlSelect, [id], (error, rows) => {
        if (error) {
            console.log("Error al buscar la banda: " + error);
            res.status(500).send("Hubo un problema al buscar la banda.");
            return;
        }

        if (rows.length === 0) {
            console.log("No se encontró la banda con ID: " + id);
            res.status(404).send("No se encontró la banda con el ID proporcionado.");
            return;
        }

        const current_date = rows[0].date || ""; // Si no hay valor, establece un valor vacío
        const current_time = rows[0].time || ""; // Si no hay valor, establece un valor vacío
        const current_hour = rows[0].hour || ""; // Si no hay valor, establece un valor vacío

        const new_date = current_date + date;
        const new_time = current_time + time;
        const new_hour = current_hour + hour;
        connection.query(sqlUpdate, [new_date, new_time, new_hour, id], (error, result) => {
            if (error) {
                console.log("Error al actualizar el registro: " + error);
                res.status(500).send("Hubo un problema al actualizar el registro.");
                return;
            }

            console.log("Registro actualizado correctamente.");
            res.status(200).send("Registro actualizado correctamente.");
        });
    });
});

app.get("/getRegisters/:id", (req, res) => {
    const bandId = req.params.id; // Obtener el ID de la banda de la ruta

    // Construir la consulta SQL filtrando por el ID de la banda
    const sql = "SELECT date, time FROM bands WHERE id = ?";
    
    connection.query(sql, [bandId], (err, result) => {
        if (err) {
            console.log("Error al traer registros " + err);
            res.status(500).json({ error: "Error al traer los registros" });
        } else {
            console.log("Registros traidos con exito " + res.json(result));
            res.status(200).json({ result });
        }
    });



});

// ELIMINAR BANDA
app.delete("/deleteBand/:id", (req, res) => { // Cambiado a DELETE
    const id = req.params.id
    const sql = "DELETE FROM bands WHERE id = ?";
  
    connection.query(sql, [id], (err, response) => {
      if (err) {
        res.status(500).send("error al eliminar banda " + err);
        console.log("error al eliminar banda");
      } else {
        res.status(200).send("Banda eliminada correctamente");
        console.log("banda eliminada correctamente");
      }
    });
  });

// MODIFICAR BANDA


app.post("/changeInBand/number/:id", (req, res) => {
  const { number } = req.body;
  const { id } = req.params;
  const values = [number, id]; // Define 'values' con los valores a utilizar en la consulta SQL
  console.log("esto esta llegando al backend" + values)
  const sql = 'UPDATE bands SET number = ? WHERE id = ?'; // Corrige la consulta SQL
  // Ejecuta la consulta SQL
  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error al modificar la banda:", err);
      res.status(500).send("Error al modificar la banda");
    } else {
      console.log("Banda modificada correctamente");
      res.status(200).send("Banda modificada correctamente");
    }
  });
});

app.post("/changeInBand/email/:id", (req, res) => {
const { email } = req.body;
const { id } = req.params;
const values = [email, id]; // Define 'values' con los valores a utilizar en la consulta SQL
console.log("esto esta llegando al backend" + values)
const sql = 'UPDATE bands SET email = ? WHERE id = ?'; // Corrige la consulta SQL
// Ejecuta la consulta SQL
connection.query(sql, values, (err, result) => {
  if (err) {
    console.error("Error al modificar la banda:", err);
    res.status(500).send("Error al modificar la banda");
  } else {
    console.log("Banda modificada correctamente");
    res.status(200).send("Banda modificada correctamente");
  }
});
});

app.post("/changeInBand/numberandemail/:id", (req, res) => {
const {number, email } = req.body;
const { id } = req.params;
if (!id) {
  return res.status(400).send("El ID de la banda es requerido");
}
const values = [number, email, id]; // Define 'values' con los valores a utilizar en la consulta SQL
const sql = 'UPDATE bands SET number = ?, email = ? WHERE id = ?'; // Corrige la consulta SQL
console.log("esto esta llegando al backend" + values)
// Ejecuta la consulta SQL
connection.query(sql, values, (err, result) => {
  if (err) {
    console.error("Error al modificar la banda:", err);
    res.status(500).send("Error al modificar la banda");
  } else {
    console.log("Banda modificada correctamente");
    res.status(200).send("Banda modificada correctamente");
  }
});
});
  

// ENVIAR EMAILS ORM

app.post("/sendMessage", async (req, res) => {
    const { email, motive, message } = req.body;

    // Verificar si los datos necesarios están presentes
    if (!email || !motive || !message) {
        return res.status(400).send("Faltan datos requeridos para enviar el correo electrónico."),
    console.log("ffaltan datos requeridos");
    }

    try {
        // Llamar a la función sendMailFunction para enviar el correo electrónico
        sendMailFunction(email, motive, message, (error, response) => {
            if (error) {
                // Si hay un error, responder con un código 500 y el mensaje de error
                return res.status(500).send(response),
                console.log("mensaje enviado correctamente " + response)
            } else {
                // Si se envía correctamente, responder con un código 200 y el mensaje de éxito
                return res.status(200).send(response),
                console.log("correo enviado con exito" + response);
            }
        });
    } catch (error) {
        // Si ocurre algún error, responder con un mensaje de error
        console.error("Error al enviar correo electrónico:", error);
        res.status(500).send("Error del servidor para envío de correo electrónico: " + error.message);
    }
});