const SOAP_URL = '/Service.svc';

document.addEventListener('DOMContentLoaded', () => {
    cargarVehiculos();

    // Modal Logic
    const modal = document.getElementById('modalNuevoVehiculo');
    document.getElementById('btnNuevoVehiculo').addEventListener('click', () => modal.classList.add('show'));
    document.getElementById('closeModal').addEventListener('click', () => modal.classList.remove('show'));
    document.getElementById('btnCancel').addEventListener('click', () => modal.classList.remove('show'));
    
    // Save Action
    document.getElementById('btnSave').addEventListener('click', guardarVehiculo);
});

async function cargarVehiculos() {
    const xmlRequest = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
       <soapenv:Header/>
       <soapenv:Body>
          <tem:ObtenerVehiculos/>
       </soapenv:Body>
    </soapenv:Envelope>`;

    try {
        const response = await fetch(SOAP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                'SOAPAction': 'http://tempuri.org/IVehiculoService/ObtenerVehiculos'
            },
            body: xmlRequest
        });

        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        
        // El namespace en CoreWCF por defecto al devolver listas suele ser diferente dependiendo de la configuración.
        // Buscamos los nodos que correspondan a Vehiculo (a(namespace):Vehiculo o simplemente Vehiculo)
        const vehiculos = xmlDoc.getElementsByTagName('*');
        let trHTML = '';
        let count = 0;

        // Bucle rudimentario para parsear WCF XML
        for (let i = 0; i < vehiculos.length; i++) {
            const node = vehiculos[i];
            if (node.localName === 'Vehiculo') {
                count++;
                
                let id = getTagValue(node, 'IdVehiculo') || getTagValue(node, 'idVehiculo');
                let placa = getTagValue(node, 'Placa') || getTagValue(node, 'placa');
                let marca = getTagValue(node, 'Marca') || getTagValue(node, 'marca');
                let modelo = getTagValue(node, 'Modelo') || getTagValue(node, 'modelo');
                let anio = getTagValue(node, 'Anio') || getTagValue(node, 'anio');
                let precio = parseFloat(getTagValue(node, 'Precio') || getTagValue(node, 'precio') || 0).toFixed(2);
                let estadoStr = getTagValue(node, 'Estado') || getTagValue(node, 'estado');
                let estado = estadoStr === 'true' || estadoStr === 'True';

                trHTML += `
                    <tr>
                        <td>#${id}</td>
                        <td><strong>${placa}</strong></td>
                        <td>${marca} ${modelo}</td>
                        <td>${anio}</td>
                        <td>$${precio}</td>
                        <td><span class="badge ${estado ? 'badge-active' : 'badge-inactive'}">${estado ? 'Activo' : 'Inactivo'}</span></td>
                        <td>
                            <button class="btn btn-danger-sm" onclick="eliminarVehiculo(${id})">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            }
        }

        if(count === 0) {
            trHTML = '<tr><td colspan="7" style="text-align:center; padding: 2rem;">No hay vehículos registrados</td></tr>';
        }

        document.getElementById('vehiculosTableBody').innerHTML = trHTML;
        document.getElementById('loader').style.display = 'none';
        document.getElementById('tableContainer').style.display = 'block';

    } catch (error) {
        console.error("Error al cargar vehículos:", error);
        alert("Error de conexión al SOAP. Mira la consola.");
    }
}

// Función auxiliar para sacar valores ignorando namespaces en XML
function getTagValue(parentNode, tagName) {
    for (let i = 0; i < parentNode.children.length; i++) {
        if (parentNode.children[i].localName === tagName) {
            return parentNode.children[i].textContent;
        }
    }
    return null;
}

async function guardarVehiculo() {
    const placa = document.getElementById('placa').value;
    const marca = document.getElementById('marca').value;
    const modelo = document.getElementById('modelo').value;
    const anio = document.getElementById('anio').value;
    const precio = document.getElementById('precio').value;
    const idCategoria = document.getElementById('idCategoria').value;
    const estado = document.getElementById('estado').checked;

    if(!placa || !marca || !modelo || !precio || !idCategoria) {
        alert("Por favor completa los campos principales.");
        return;
    }

    document.getElementById('btnSave').disabled = true;
    document.getElementById('btnSave').innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';

    const xmlRequest = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/" xmlns:aut="http://schemas.datacontract.org/2004/07/AutoSoap.Models">
       <soapenv:Header/>
       <soapenv:Body>
          <tem:AgregarVehiculo>
             <tem:vehiculo>
                <aut:Anio>${anio}</aut:Anio>
                <aut:Estado>${estado}</aut:Estado>
                <aut:IdCategoria>${idCategoria}</aut:IdCategoria>
                <aut:Marca>${marca}</aut:Marca>
                <aut:Modelo>${modelo}</aut:Modelo>
                <aut:Placa>${placa}</aut:Placa>
                <aut:Precio>${precio}</aut:Precio>
             </tem:vehiculo>
          </tem:AgregarVehiculo>
       </soapenv:Body>
    </soapenv:Envelope>`;

    try {
        const response = await fetch(SOAP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                'SOAPAction': 'http://tempuri.org/IVehiculoService/AgregarVehiculo'
            },
            body: xmlRequest
        });

        if(response.ok) {
            document.getElementById('formVehiculo').reset();
            document.getElementById('modalNuevoVehiculo').classList.remove('show');
            document.getElementById('loader').style.display = 'flex';
            document.getElementById('tableContainer').style.display = 'none';
            await cargarVehiculos();
        } else {
            alert("Error al guardar en el servidor SOAP.");
        }
    } catch (error) {
        console.error("Error al guardar:", error);
        alert("Error de red.");
    } finally {
        document.getElementById('btnSave').disabled = false;
        document.getElementById('btnSave').innerHTML = '<i class="fa-solid fa-save"></i> Guardar';
    }
}

async function eliminarVehiculo(id) {
    if(!confirm('¿Estás seguro de que deseas eliminar el vehículo ID ' + id + '?')) return;

    const xmlRequest = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
       <soapenv:Header/>
       <soapenv:Body>
          <tem:EliminarVehiculo>
             <tem:id>${id}</tem:id>
          </tem:EliminarVehiculo>
       </soapenv:Body>
    </soapenv:Envelope>`;

    try {
        const response = await fetch(SOAP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                'SOAPAction': 'http://tempuri.org/IVehiculoService/EliminarVehiculo'
            },
            body: xmlRequest
        });

        if(response.ok) {
            document.getElementById('loader').style.display = 'flex';
            document.getElementById('tableContainer').style.display = 'none';
            await cargarVehiculos();
        } else {
            alert("Error al eliminar.");
        }
    } catch (error) {
        console.error("Error al eliminar:", error);
    }
}
