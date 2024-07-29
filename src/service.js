require("express-async-errors");
const express = require('express');
const app = express();
const AppError = require("./utils/AppError");
const router = require('./routes');


app.use(express.json());
app.use(router);

app.use((error, req, res, next) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            status: "Error",
            message: error.message
        });
    }

    console.error(error);

    return res.status(500).json({
        status: "error",
        message: "Internal server error"
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
