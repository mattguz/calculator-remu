function diasAusente() {
    if (
        document.getElementById("column_diaslaborales").style.visibility ==
        "visible"
    )
        document.getElementById("column_diaslaborales").style.visibility = "hidden";
    else
        document.getElementById("column_diaslaborales").style.visibility =
            "visible";
    if (document.getElementById("column_diasausente").style.visibility == "visible")
        document.getElementById("column_diasausente").style.visibility = "hidden";
    else document.getElementById("column_diasausente").style.visibility = "visible";
}

function prevision() {
    if (document.getElementById("column_salud").style.visibility == "visible")
        document.getElementById("column_salud").style.visibility = "hidden";
    else document.getElementById("column_salud").style.visibility = "visible";
}

function calcularSueldo() {
    // Parámetros
    // Topes Imponibles
    const topeAfp = 81.6 * parseFloat(document.getElementById("txtuf").value);
    const topeCesantia =
        122.6 * parseFloat(document.getElementById("txtuf").value);
    // Sueldo Mínimo
    const sueldoMinimo = parseFloat(
        document.getElementById("txtsueldo_minimo").value
    );
    // Valores Intermedios
    // Sueldo Base
    let sueldoBase = parseFloat(
        document.getElementById("txtsueldo_base").value
    );
    if (parseFloat(document.getElementById("cmbausente").value) == 1)
        sueldoBase = Math.round(
            (sueldoBase *
                (parseFloat(document.getElementById("txtdiaslaborales").value) -
                    parseFloat(
                        document.getElementById("txtdiasausente").value
                    ))) /
                parseFloat(document.getElementById("txtdiaslaborales").value)
        );
    // Gratificación
    let gratificacion = 0;
    if (parseFloat(document.getElementById("cmbgratificacion").value) == 1)
        gratificacion = Math.round(
            Math.min((sueldoMinimo * 4.75) / 12, sueldoBase * 0.25)
        );
    document.getElementById("lblgratificacion").innerHTML =
        gratificacion.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
    // Valor Horas Extras
    const horasExtra = Math.round(
        sueldoBase *
            0.0077777 *
            parseFloat(document.getElementById("txthorasextras").value)
    );
    document.getElementById("lblhoras_extras").innerHTML =
        horasExtra.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
    // Haberes no imponibles
    const haberesNoImponibles =
        parseFloat(document.getElementById("txtcol").value) +
        parseFloat(document.getElementById("txtmovilizacion").value) +
        parseFloat(document.getElementById("txtasignacionfamiliar").value);
    document.getElementById("lblhaberes_noimponibles").innerHTML =
        haberesNoImponibles.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
    // Haberes imponibles
    const haberesImponibles =
        sueldoBase +
        parseFloat(document.getElementById("txtcomisiones").value) +
        parseFloat(document.getElementById("txtsemanacorrida").value) +
        parseFloat(document.getElementById("txtbonos").value) +
        gratificacion +
        horasExtra;
    document.getElementById("lblhaberes_imponibles").innerHTML =
        haberesImponibles.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
    // Seguro de Cesantía
    let seguroCesantia = 0;
    if (parseFloat(document.getElementById("cmbafc").value) == 0)
        seguroCesantia = Math.round(
            Math.min(haberesImponibles * 0.006, topeCesantia)
        );
    document.getElementById("lblseguro_cesantia").innerHTML =
        seguroCesantia.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
    // Descuento AFP
    const descuentoAFP = Math.round(
        Math.min(topeAfp, haberesImponibles) *
            parseFloat(document.getElementById("cmbafp").value)
    );
    document.getElementById("lbldescuento_afp").innerHTML =
        descuentoAFP.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
    // Descuento Salud
    let descuentoSalud = 0;
    if (document.getElementById("cmbprevision").value == "Isapre")
        descuentoSalud = Math.round(
            parseFloat(document.getElementById("txtuf").value) *
                parseFloat(document.getElementById("txtsalud").value)
        );
    else
        descuentoSalud = Math.round(
            0.07 * Math.min(topeAfp, haberesImponibles)
        );
    document.getElementById("lbldescuento_salud").innerHTML =
        descuentoSalud.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
    // Base Tributable
    const baseTributable =
        haberesImponibles -
        seguroCesantia -
        descuentoAFP -
        descuentoSalud -
        parseFloat(document.getElementById("txtdescuentoslegales").value) -
        Math.round(
            parseFloat(document.getElementById("txtapvuf").value) *
                parseFloat(document.getElementById("txtuf").value)
        );
    document.getElementById("lblbase_tributable").innerHTML =
        baseTributable.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
    // Impuesto
    const valorUTM = parseFloat(document.getElementById("txtutm").value);
    const getImpuesto = (monto, valorUTM) => {
        const montoUTM = monto / valorUTM;
        if (montoUTM > 310) return monto * 0.4 - 38.82 * valorUTM;
        if (montoUTM > 120) return monto * 0.35 - 23.32 * valorUTM;
        if (montoUTM > 90) return monto * 0.304 - 17.8 * valorUTM;
        if (montoUTM > 70) return monto * 0.23 - 11.14 * valorUTM;
        if (montoUTM > 50) return monto * 0.135 - 4.49 * valorUTM;
        if (montoUTM > 30) return monto * 0.08 - 1.74 * valorUTM;
        if (montoUTM > 13.5) return monto * 0.04 - 0.54 * valorUTM;
        return 0;
    };
    const impuesto = Math.round(getImpuesto(baseTributable, valorUTM));
    //let impuesto = Math.round(calcular_impuesto(baseTributable))
    document.getElementById("lblimpuesto").innerHTML = impuesto.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
    // Total Haberes
    const totalHaberes = haberesImponibles + haberesNoImponibles;
    document.getElementById("lbltotal_haberes").innerHTML =
        totalHaberes.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
    // Total Descuentos
    const totalDescuentos =
        parseFloat(document.getElementById("txtdescuentoslegales").value) +
        parseFloat(document.getElementById("txtdescuentos").value) +
        seguroCesantia +
        descuentoSalud +
        descuentoAFP +
        impuesto;
    document.getElementById("lbltotal_descuentos").innerHTML =
        totalDescuentos.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
    // Sueldo Líquido
    const sueldoLiquido = totalHaberes - totalDescuentos;
    document.getElementById("lblliquido").innerHTML = sueldoLiquido.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
}

const getJSON = async () => {
    const data = await fetch(
        "http://d3nk1otf0qe6jp.cloudfront.net/data.json"
    ).then((r) => r.json());
    return data;
};

const updateValues = async () => {
    try {
        const data = await getJSON();
        const uf = data.UF.Valor.replaceAll(".", "").replaceAll(",", ".");
        const utm = data.UTM.Valor.replaceAll(".", "").replaceAll(",", ".");
        console.log({ uf, utm });
        document.getElementById("valor_uf_lbl").innerText =
            "Valor UF " + dayjs(data.UF.Fecha).format("DD/MM/YYYY");
        document.getElementById("valor_utm_lbl").innerText =
            "Valor UTM " + dayjs(data.UTM.Fecha).format("DD/MM/YYYY");
        document.getElementById("txtuf").value = uf;
        document.getElementById("txtutm").value = utm;
        calcularSueldo();
    } catch (error) {
        console.log(error);
        alert(
            "No se pudo obtener el valor actualizado de UF y UTM, por favor rellenar de forma manual"
        );
        document.getElementById("txtuf").value = 0;
        document.getElementById("txtutm").value = 0;
    }
};

// Llama la función que actualiza UTM y UF al abrir la página
if (typeof window !== "undefined") {
    window.onload = updateValues();
}

// TODO:
// [] Los campos que vienen seteados no deben verse como campos editables
// [] Agregar currency a los valores
// [] Arreglar el formato del tooltip, que se adapte al div y texto
