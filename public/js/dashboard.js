const urlUsuarios = 'http://tu-jardin-ya.vercel.app/api/admin/usuarios';
const urlAgenda = 'http://tu-jardin-ya.vercel.app/api/agenda';

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token'); 

  if (!token) {
    console.log('No se encontró token, redirigiendo al login');
    window.location.href = '../index.html';
    return;
  }

  const decodedToken = JSON.parse(atob(token.split('.')[1])); 
  const userRole = decodedToken.role; 
  const usuario = decodedToken.usuario; 
  const email = decodedToken.email; 

  console.log('Token decodificado, datos del usuario:', { userRole, usuario, email });

  if (!userRole || !usuario || !email) {
    console.log('Datos del usuario incompletos, redirigiendo al login');
    window.location.href = '../index.html';
    return;
  }

  const accountIcon = document.getElementById('account-icon');
  const userInfoDiv = document.getElementById('user-info');
  accountIcon.textContent = `${usuario.charAt(0).toUpperCase()}`; 

  accountIcon.addEventListener('click', () => {
    userInfoDiv.innerHTML = `
      <p><strong>Usuario:</strong> ${usuario}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Rol:</strong> ${userRole}</p>
    `;
    userInfoDiv.style.display = 'block'; 
  });

  async function obtenerUsuarios() {
    try {
      console.log('Enviando solicitud GET a', urlUsuarios);
      const response = await fetch(urlUsuarios, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('No autorizado o error al obtener usuarios');
      }

      const users = await response.json(); 
      mostrarUsuarios(users); 
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      document.getElementById('user-list').innerHTML = '<tr><td colspan="3">No tienes permisos para ver los usuarios o ocurrió un error.</td></tr>';
    }
  }

  async function obtenerAgenda() {
    try {
      const response = await fetch(urlAgenda, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('No autorizado o error al obtener la agenda');
      }

      const agenda = await response.json(); 
      mostrarAgenda(agenda); 
    } catch (error) {
      console.error('Error al obtener la agenda:', error);
      document.getElementById('services-list').innerHTML = '<tr><td colspan="6">No tienes permisos para ver la agenda o ocurrió un error.</td></tr>';
    }
  }

  async function actualizarEstado(id, nuevoEstado) {
    try {
      const response = await fetch(`${urlAgenda}/${id}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el estado');
      }

      // Refrescar la lista de agenda después de la actualización
      obtenerAgenda();
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
    }
  }

  // Muestra los usuarios al admin 
  function mostrarUsuarios(users) {
    const userList = document.getElementById('user-list');
    userList.innerHTML = ''; 
  
    users.forEach(user => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${user.usuario}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
       
      `;
      userList.appendChild(tr);
    });
  
    // Añadir eventos a los botones de eliminar
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', (event) => {
        const id = event.target.dataset.id;
        eliminarUsuario(id);
      });
    });
  }
  
  async function eliminarUsuario(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        const response = await fetch(`${urlUsuarios}/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al eliminar el usuario');
        }
  
        // Refrescar la lista de usuarios después de la eliminación
        obtenerUsuarios();
      } catch (error) {
        console.error('Error al eliminar el usuario:', error);
      }
    }
  }
 
function mostrarAgenda(agenda) {
  const servicesList = document.getElementById('services-list');
  servicesList.innerHTML = ''; 

  agenda.forEach(item => {
      // Crea un div para la tarjeta
      const card = document.createElement('div');
      card.className = 'service-card';

      // Agrega el contenido de la tarjeta
      card.innerHTML = `
          <h3>${item.titulo}</h3>
          <p><strong>Descripción:</strong> ${item.descripcion}</p>
          <p><strong>Dirección:</strong> ${item.direccion}</p>
          <p><strong>Fecha:</strong> ${item.fecha}</p>
          <p><strong>Hora:</strong> ${item.hora}</p>
          <p><strong>Estado:</strong> ${item.estado}</p>
          <button class="edit-btn" data-id="${item._id}">Editar</button>
      `;
      // Agrega la tarjeta al contenedor
      servicesList.appendChild(card);
  });

  // Añadir eventos a los botones de editar
  document.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', (event) => {
          const id = event.target.dataset.id;
          abrirModal(id);
      });
  });
}

  document.getElementById('welcomeMessage').textContent = `¡Bienvenido ${usuario}!`;
  
  if (userRole === 'admin') {
    obtenerUsuarios();
    obtenerAgenda();
    document.getElementById('adminMetrics').style.display = 'block'; 
  } else {
    obtenerAgenda();
    document.getElementById('adminMetrics').style.display = 'none'; 
  }

  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../index.html';
  });

  // Funciones para manejar el modal de edición
  const modal = document.getElementById('editModal');
  const closeModalBtn = document.querySelector('.modal .close');
  let editId;

  function abrirModal(id) {
    editId = id;
    modal.style.display = 'block';
  }

  closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  document.getElementById('editForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const nuevoEstado = document.getElementById('editEstado').value;
    actualizarEstado(editId, nuevoEstado);
    modal.style.display = 'none';
  });
});
