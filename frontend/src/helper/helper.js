const jwt = require('jsonwebtoken');

export const jsonIsValid = jsonStr => {

    if (jsonStr == null) { return true } else { return false };
    // try {
    //     JSON.parse(jsonStr);
    //     return true;
    // } catch (e) {
    //     return false;
    // }
}


export const fechaActual = (fecha, formato) => {
    const map = {
        dd: fecha.getDate() - 1,
        mm: fecha.getMonth() + 1,
        yyyy: fecha.getFullYear()
    }

    return formato.replace(/mm|dd|yyyy/gi, matched => map[matched])
}

export const restarDias = (fecha, dias) => {
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
}

export const getTotals = (data, key) => {
    let total = 0;
    data.forEach(item => {
        total += parseFloat(item[key]);
    });
    return total;
};


export const getPromedio = (data, key) => {
    let promedio = data.length;
    let total = 0;
    let cont = 0;

    data.forEach(item => {
        total += parseFloat(item[key], 2);
        if (parseFloat(item[key], 2) > 0) cont++;
    });
    total = total > 0 ? parseInt(total / cont) : 0;
    return total;
};

export const generateToken = (id_ett, id_ruta, placa, fecha) => {
    const token = jwt.sign(
        {
            id_ett: id_ett,
            id_ruta: id_ruta,
            placa: placa,
            fecha: fecha
        },
        "giz_plataforma_2021$$", { expiresIn: '7d' }
    );
    return token;
};