const url = 'http://localhost:3000/api/auth/login'; // URL del backend

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Inicio de sesión exitoso, almacenando token...');
            localStorage.setItem('token', data.token); // Almacena el token
            console.log('Token almacenado:', data.token); // Verifica que el token se haya almacenado

            // Decodificar el token JWT para obtener los detalles del usuario
            const decodedToken = JSON.parse(atob(data.token.split('.')[1])); // Decodifica el token JWT
            console.log('Token decodificado:', JSON.stringify(decodedToken, null, 2)); // Verifica que el token se haya decodificado correctamente

            // Verificar si el token ha expirado
            const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
            if (decodedToken.exp && decodedToken.exp < currentTime) {
                console.error('Token ha expirado');
                alert('Token ha expirado, por favor vuelve a iniciar sesión');
                return;
            }

            const userDetails = {
                userId: decodedToken.userId,
                role: decodedToken.role,
                email: decodedToken.email, // Asegúrate de que el token tenga este campo
                usuario: decodedToken.usuario // Asegúrate de que el token tenga este campo
            };

            console.log('Detalles del usuario:', userDetails); // Verifica los detalles del usuario decodificados
            localStorage.setItem('user', JSON.stringify(userDetails)); // Almacenar los detalles del usuario

            // Verificar y ajustar la redirección dependiendo del rol
            if (userDetails.role === 'admin') {
                console.log('Redirigiendo al dashboard del admin...');
                window.location.href = 'http://localhost:3000/html/dashboard.html'; // Redirigir al dashboard del admin
            } else {
                console.log('Redirigiendo a la página de agenda...');
                window.location.href = './html/agenda.html'; // Ajustar la ruta a la página correcta de la agenda
            }
        } else {
            alert(data.message); // Muestra el mensaje de error
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al iniciar sesión');
    }
});


