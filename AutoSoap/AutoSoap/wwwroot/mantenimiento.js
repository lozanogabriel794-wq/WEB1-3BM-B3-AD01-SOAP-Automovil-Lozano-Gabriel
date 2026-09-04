document.addEventListener('DOMContentLoaded', () => {
    // Nav elements
    const navVehiculos = document.getElementById('navVehiculos');
    const navMantenimientos = document.getElementById('navMantenimientos');
    
    // Containers
    const headerVehiculos = document.getElementById('headerVehiculos');
    const headerMantenimientos = document.getElementById('headerMantenimientos');
    const tableVehiculosContainer = document.getElementById('tableContainer');
    const tableMantenimientosContainer = document.getElementById('tableMantenimientosContainer');
    
    // Modal
    const modalMantenimiento = document.getElementById('modalMantenimiento');
    const btnNuevoMantenimiento = document.getElementById('btnNuevoMantenimiento');
    const closeModalMantenimiento = document.getElementById('closeModalMantenimiento');
    const btnCancelMantenimiento = document.getElementById('btnCancelMantenimiento');
    const formMantenimiento = document.getElementById('formMantenimiento');
    const btnSaveMantenimiento = document.getElementById('btnSaveMantenimiento');
    
    const mantenimientosTableBody = document.getElementById('mantenimientosTableBody');
    const API_URL = '/api/mantenimientos';

    // Navegación entre vistas
    navVehiculos.addEventListener('click', (e) => {
        e.preventDefault();
        navVehiculos.classList.add('active');
        navMantenimientos.classList.remove('active');
        
        headerVehiculos.style.display = 'flex';
        tableVehiculosContainer.style.display = 'block';
        
        headerMantenimientos.style.display = 'none';
        tableMantenimientosContainer.style.display = 'none';
    });

    navMantenimientos.addEventListener('click', (e) => {
        e.preventDefault();
        navMantenimientos.classList.add('active');
        navVehiculos.classList.remove('active');
        
        headerMantenimientos.style.display = 'flex';
        tableMantenimientosContainer.style.display = 'block';
        
        headerVehiculos.style.display = 'none';
        tableVehiculosContainer.style.display = 'none';
        
        cargarMantenimientos(); // Cargar datos al entrar a la vista
    });

    // Abrir modal
    btnNuevoMantenimiento.addEventListener('click', () => {
        formMantenimiento.reset();
        document.getElementById('mantId').value = '0';
        document.getElementById('modalMantenimientoTitle').textContent = 'Agregar Mantenimiento';
        modalMantenimiento.style.display = 'flex';
    });

    // Cerrar modal
    const closeMantModal = () => { modalMantenimiento.style.display = 'none'; };
    closeModalMantenimiento.addEventListener('click', closeMantModal);
    btnCancelMantenimiento.addEventListener('click', (e) => { e.preventDefault(); closeMantModal(); });

    // Cargar mantenimientos desde REST API
    async function cargarMantenimientos() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Error al cargar mantenimientos');
            const data = await response.json();
            renderMantenimientos(data);
        } catch (error) {
            console.error(error);
            // alert('Hubo un problema al cargar los mantenimientos');
        }
    }

    // Renderizar tabla
    function renderMantenimientos(mantenimientos) {
        mantenimientosTableBody.innerHTML = '';
        if (mantenimientos.length === 0) {
            mantenimientosTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay mantenimientos registrados</td></tr>';
            return;
        }

        mantenimientos.forEach(m => {
            const tr = document.createElement('tr');
            const fechaFormat = new Date(m.fecha).toLocaleDateString();
            tr.innerHTML = `
                <td>${m.idMantenimiento}</td>
                <td>${fechaFormat}</td>
                <td>${m.tipo}</td>
                <td>$${m.costo.toFixed(2)}</td>
                <td>${m.idVehiculo}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit-btn" onclick="editarMantenimiento(${m.idMantenimiento})" title="Editar"><i class="fa-solid fa-pen"></i></button>
                        <button class="action-btn delete-btn" onclick="eliminarMantenimiento(${m.idMantenimiento})" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </td>
            `;
            mantenimientosTableBody.appendChild(tr);
        });
    }

    // Guardar o Actualizar
    btnSaveMantenimiento.addEventListener('click', async (e) => {
        e.preventDefault();
        
        if (!formMantenimiento.checkValidity()) {
            formMantenimiento.reportValidity();
            return;
        }

        const id = parseInt(document.getElementById('mantId').value);
        const mantenimiento = {
            idMantenimiento: id,
            fecha: document.getElementById('mantFecha').value,
            tipo: document.getElementById('mantTipo').value,
            descripcion: document.getElementById('mantDescripcion').value,
            costo: parseFloat(document.getElementById('mantCosto').value),
            kilometraje: parseFloat(document.getElementById('mantKilometraje').value),
            estado: document.getElementById('mantEstado').checked,
            idVehiculo: parseInt(document.getElementById('mantIdVehiculo').value)
        };

        const method = id === 0 ? 'POST' : 'PUT';
        const url = id === 0 ? API_URL : `${API_URL}/${id}`;

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mantenimiento)
            });

            if (response.ok) {
                closeMantModal();
                cargarMantenimientos();
            } else {
                alert('Error al guardar el mantenimiento');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión');
        }
    });

    // Funciones globales para botones en tabla (edit/delete)
    window.editarMantenimiento = async function(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            if (response.ok) {
                const m = await response.json();
                
                document.getElementById('mantId').value = m.idMantenimiento;
                document.getElementById('mantFecha').value = m.fecha.split('T')[0];
                document.getElementById('mantTipo').value = m.tipo;
                document.getElementById('mantDescripcion').value = m.descripcion;
                document.getElementById('mantCosto').value = m.costo;
                document.getElementById('mantKilometraje').value = m.kilometraje;
                document.getElementById('mantIdVehiculo').value = m.idVehiculo;
                document.getElementById('mantEstado').checked = m.estado;

                document.getElementById('modalMantenimientoTitle').textContent = 'Editar Mantenimiento';
                modalMantenimiento.style.display = 'flex';
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    window.eliminarMantenimiento = async function(id) {
        if (confirm('¿Está seguro de eliminar este mantenimiento?')) {
            try {
                const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    cargarMantenimientos();
                } else {
                    alert('Error al eliminar');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };
});
