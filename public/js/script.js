document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = 'http://localhost:3000/api/agenda';
  const esAdmin = false; // Cambia esto según sea necesario para el perfil del usuario

  function mostrarCamposAdmin(esAdmin) {
    const estadoLabel = document.getElementById('estado-label');
    const estadoInput = document.getElementById('estado');

    if (estadoLabel && estadoInput) {
      if (esAdmin) {
        estadoLabel.style.display = 'block';
        estadoInput.style.display = 'block';
      } else {
        estadoLabel.style.display = 'none';
        estadoInput.style.display = 'none';
      }
    } else {
      console.error('Elementos "estado-label" o "estado" no encontrados en el DOM');
    }
  }

  mostrarCamposAdmin(esAdmin);

function getAgenda() {
  fetch(apiUrl)
      .then(response => response.json())
      .then(items => {
          const agendaList = document.getElementById('agenda-list');
          agendaList.innerHTML = '';

          items.forEach(agenda => {
              // Crea un div para la tarjeta
              const card = document.createElement('div');
              card.className = 'agenda-card';

              // Agrega el contenido de la tarjeta
              card.innerHTML = `
                  <h3>${agenda.titulo}</h3>
                  <p><strong>Descripción:</strong> ${agenda.descripcion}</p>
                  <p><strong>Dirección:</strong> ${agenda.direccion}</p>
                  <p><strong>Fecha:</strong> ${agenda.fecha}</p>
                  <p><strong>Hora:</strong> ${agenda.hora}</p>
                  <p><strong>Estado:</strong> ${agenda.estado}</p>
              `;

              // Botón de editar
              const editarBoton = document.createElement('button');
              editarBoton.textContent = 'Editar';
              editarBoton.className = 'edit-btn';
              editarBoton.addEventListener('click', () => editarAgenda(agenda));

              // Botón de eliminar
              const deleteButton = document.createElement('button');
              deleteButton.textContent = 'Eliminar';
              deleteButton.className = 'delete-btn';
              deleteButton.addEventListener('click', () => deleteAgenda(agenda._id));

              // Agrega los botones a la tarjeta
              card.appendChild(editarBoton);
              card.appendChild(deleteButton);

              // Agrega la tarjeta al contenedor
              agendaList.appendChild(card);
          });
      })
      .catch(error => console.error('Error al obtener la agenda:', error));
}


  document.getElementById('agenda-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
    const direccion = document.getElementById('direccion').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const estado = esAdmin ? document.getElementById('estado').value : 'pendiente';
    const agendaId = e.target.dataset.id;

    const nuevaAgenda = { titulo, descripcion, direccion, fecha, hora, estado };

    console.log('Datos a enviar:', nuevaAgenda); // Añade esto para verificar los datos en la consola

    if (agendaId) {
      updateAgenda(agendaId, nuevaAgenda);
    } else {
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaAgenda),
      })
      .then(res => res.json())
      .then(() => {
        alert("Agenda creada correctamente");
        document.getElementById('agenda-form').reset();
        getAgenda();
      })
      .catch(error => console.error('Error al crear la agenda:', error));
    }
  });

  function updateAgenda(id, agenda) {
    fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agenda),
    })
    .then(res => res.json())
    .then(() => {
      getAgenda();
      document.getElementById('agenda-form').reset();
      document.getElementById('agenda-form').dataset.id = '';
    })
    .catch(error => console.error('Error al actualizar la Agenda:', error));
  }

  function deleteAgenda(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta Cita de tu Agenda?')) {
      fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
      })
      .then(() => {
        getAgenda();
      })
      .catch(error => console.error('Error al eliminar la Cita de la agenda:', error));
    }
  }

  function editarAgenda(agenda) {
    document.getElementById('titulo').value = agenda.titulo;
    document.getElementById('descripcion').value = agenda.descripcion;
    document.getElementById('direccion').value = agenda.direccion;

    // Convertir fecha al formato yyyy-MM-dd
    const fecha = new Date(agenda.fecha);
    const yyyy = fecha.getFullYear();
    const mm = String(fecha.getMonth() + 1).padStart(2, '0'); // Meses empiezan en 0
    const dd = String(fecha.getDate()).padStart(2, '0');
    const fechaFormateada = `${yyyy}-${mm}-${dd}`;

    document.getElementById('fecha').value = fechaFormateada;
    document.getElementById('hora').value = agenda.hora;

    if (esAdmin) {
      document.getElementById('estado').value = agenda.estado;
    }

    document.getElementById('agenda-form').dataset.id = agenda._id;
  }

  document.getElementById('obtener_agenda').addEventListener('click', (e) => {
    e.preventDefault();
    getAgenda();
    alert("Agenda obtenida");
  });

  document.getElementById('limpiar_agenda').addEventListener('click', (e) => {
    e.preventDefault();
    const agendaLists = document.getElementById('agenda-list');
    agendaLists.innerHTML = '';
    document.getElementById('agenda-form').reset();
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../index.html';
  });

  getAgenda();
});

