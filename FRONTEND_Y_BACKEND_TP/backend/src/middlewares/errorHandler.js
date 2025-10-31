const errorHandler = (err, req, res, next) => {
  console.error('🔴 Error:', err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    success: false,
    error: message
  });
};

module.exports = errorHandler;

// Captura errores lanzados en las rutas y devuelve respuestas JSON con el mensaje de error y el código de estado HTTP adecuado.
//los middleware sirven para procesar las solicitudes entrantes antes de que lleguen a las rutas o controladores, permitiendo manejar errores, autenticación, validación, etc.