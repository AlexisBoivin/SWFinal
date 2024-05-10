const express = require ('express');
const cors = require('cors');

// documentation
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./src/config/documentation.json');
const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "API Tâches"
};
// Créer une application express
const app = express();
const PORT = 3000;

app.use(cors());
const morgan = require('morgan')
const fs = require('fs');
const path = require('path');
// Create a write stream (in append mode) for the error log
const errorLogStream = fs.createWriteStream(path.join(__dirname, 'error.log'), { flags: 'a' });


// Clé d'API
const authorization = require('./src/middleware/authorization_cle_api');

app.use(express.json())

// Set up Morgan to log errors to the file
app.use(morgan('common', {
    stream: errorLogStream,
    skip: function (req, res) {
      return res.statusCode < 500; // Skip logging requests with status code less than 500
    }
}));

app.use("/api/taches", authorization, require("./src/routes/taches.route"));

app.use("/api/utilisateur", require("./src/routes/utilisateur.route"));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));



app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
