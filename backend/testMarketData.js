require("dotenv").config();

const {
    obtenerCotizacion
} = require("./services/marketDataService");

(async () => {

    try {

        const datos = await obtenerCotizacion("AAPL");

        console.log(datos);

    } catch (error) {

        console.log(error.message);

    }

})();
