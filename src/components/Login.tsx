import React, { useState } from 'react';
import { Bus, Lock, User, AlertCircle, Mail, Phone, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { addUser, userExists } from '../data/mockData';

const Login: React.FC = () => {
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'forgot-password' | 'reset-password'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para registro
  const [registerData, setRegisterData] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    celular: '',
    usuario: '',
    contraseña: '',
    confirmarContraseña: ''
  });
  const [registerErrors, setRegisterErrors] = useState<string[]>([]);
  const [passwordMismatchError, setPasswordMismatchError] = useState('');
  
  // Estados para recuperación de contraseña
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [resetPasswordData, setResetPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [resetPasswordError, setResetPasswordError] = useState('');
  
  const { login } = useAuth();

  // Cargar username recordado al montar el componente
  useEffect(() => {
    const rememberedUsername = localStorage.getItem('smartbus_remembered_username');
    if (rememberedUsername) {
      setUsername(rememberedUsername);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (!success) {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (err) {
      setError('Error del sistema. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterErrors([]);
    setPasswordMismatchError('');

    // Validar campos requeridos
    const errors: string[] = [];
    if (!registerData.nombres.trim()) errors.push('nombres');
    if (!registerData.apellidos.trim()) errors.push('apellidos');
    if (!registerData.correo.trim()) errors.push('correo');
    if (!registerData.celular.trim()) errors.push('celular');
    if (!registerData.usuario.trim()) errors.push('usuario');
    if (!registerData.contraseña.trim()) errors.push('contraseña');
    if (!registerData.confirmarContraseña.trim()) errors.push('confirmar contraseña');

    if (errors.length > 0) {
      setRegisterErrors(errors);
      return;
    }

    // Validar que las contraseñas coincidan
    if (registerData.contraseña !== registerData.confirmarContraseña) {
      setPasswordMismatchError('Las contraseñas no coinciden, revisa e inténtalo de nuevo');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.correo)) {
      setRegisterErrors(['correo']);
      return;
    }

    // Verificar si el usuario ya existe
    if (userExists(registerData.usuario)) {
      setRegisterErrors(['usuario']);
      alert('Este nombre de usuario ya existe. Por favor elige otro.');
      return;
    }

    // Crear el nuevo usuario
    const newUser = {
      username: registerData.usuario,
      password: registerData.contraseña,
      email: registerData.correo,
      phone: registerData.celular,
      firstName: registerData.nombres,
      lastName: registerData.apellidos
    };

    // Agregar el usuario a la lista
    addUser(newUser);

    // Mostrar mensaje de éxito
    alert(`¡Registrado correctamente!\n\nYa puedes iniciar sesión con tu usuario: ${registerData.usuario}`);
    
    // Limpiar formulario
    setRegisterData({
      nombres: '',
      apellidos: '',
      correo: '',
      celular: '',
      usuario: '',
      contraseña: '',
      confirmarContraseña: ''
    });
    
    // Volver al login
    setCurrentView('login');
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordError('');

    // Validar email
    if (!forgotPasswordEmail.trim()) {
      setForgotPasswordError('Por favor ingresa tu correo electrónico');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotPasswordEmail)) {
      setForgotPasswordError('Por favor ingresa un correo válido');
      return;
    }

    // Simular envío de correo (en un entorno real aquí se enviaría el correo)
    alert(`Se ha enviado un enlace de recuperación a: ${forgotPasswordEmail}\n\nEn un entorno real, recibirías un correo con un enlace para restablecer tu contraseña.`);
    
    // Simular que el usuario hace clic en el enlace del correo
    setTimeout(() => {
      setCurrentView('reset-password');
    }, 1000);
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetPasswordError('');

    // Validar campos
    if (!resetPasswordData.newPassword.trim() || !resetPasswordData.confirmPassword.trim()) {
      setResetPasswordError('Por favor completa todos los campos');
      return;
    }

    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      setResetPasswordError('Las contraseñas no coinciden');
      return;
    }

    if (resetPasswordData.newPassword.length < 5) {
      setResetPasswordError('La contraseña debe tener al menos 5 caracteres');
      return;
    }

    // Simular actualización de contraseña
    alert('¡Contraseña actualizada exitosamente!\n\nYa puedes iniciar sesión con tu nueva contraseña.');
    
    // Limpiar formulario y volver al login
    setResetPasswordData({ newPassword: '', confirmPassword: '' });
    setForgotPasswordEmail('');
    setCurrentView('login');
  };

  const renderLogin = () => (
    <div>
      {/* Logo y Título */}
      <div className="text-center mb-2 sm:mb-4">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full mb-2 sm:mb-4">
          <Bus className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
        </div>
        <h1 className="text-xl sm:text-xl lg:text-xl font-bold text-gray-900 mb-1">SMARTBUS</h1>
        <p className="text-sm sm:text-sm lg:text-sm text-blue-600 font-medium mb-1">Movilidad inteligente, ciudades eficientes</p>
        <p className="text-xs sm:text-sm lg:text-base text-gray-600">Rastrea autobuses en tiempo real y planifica tu viaje</p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="flex items-center gap-2 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            <User className="w-4 h-4 inline mr-2" />
            Usuario
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            placeholder="Ingresa tu usuario"
            autoComplete="username"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            <Lock className="w-4 h-4 inline mr-2" />
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            placeholder="Ingresa tu contraseña"
            autoComplete="current-password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
        
        {/* Enlace de ¿Olvidaste tu contraseña? */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => setCurrentView('forgot-password')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
        
        {/* Botón de Registro */}
        <button
          type="button"
          onClick={() => setCurrentView('register')}
          className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all mt-2 text-sm"
        >
          Regístrate
        </button>
      </form>

      {/* Credenciales de demostración */}
      <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs font-semibold text-gray-700 mb-2">Credenciales de prueba:</p>
        <div className="text-xs text-gray-600 space-y-1">
          <p><strong>Usuario:</strong> Julissa | <strong>Contraseña:</strong> 12345</p>
          <p><strong>Usuario:</strong> Admin | <strong>Contraseña:</strong> 12345</p>
        </div>
        <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
          <p className="text-xs text-blue-700">
            <strong>Seguridad:</strong> Tu sesión expirará automáticamente después de 20 minutos de inactividad.
          </p>
        </div>
      </div>
    </div>
  );

  const renderForgotPassword = () => (
    <div>
      {/* Header con botón de regreso */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => setCurrentView('login')}
          className="mr-3 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center flex-1">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-2">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Recuperar Contraseña</h1>
          <p className="text-sm text-gray-600">Ingresa tu correo para restablecer tu contraseña</p>
        </div>
      </div>

      {/* Formulario de Recuperación */}
      <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
        {forgotPasswordError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{forgotPasswordError}</span>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Correo electrónico
          </label>
          <input
            type="email"
            value={forgotPasswordEmail}
            onChange={(e) => {
              setForgotPasswordEmail(e.target.value);
              if (forgotPasswordError) setForgotPasswordError('');
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
            placeholder="ejemplo@correo.com"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
        >
          Enviar enlace de recuperación
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-700">
          <strong>Nota:</strong> Recibirás un correo con un enlace para restablecer tu contraseña. 
          Revisa también tu carpeta de spam.
        </p>
      </div>
    </div>
  );

  const renderResetPassword = () => (
    <div>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-2">
          <Lock className="w-6 h-6 text-green-600" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">Nueva Contraseña</h1>
        <p className="text-sm text-gray-600">Ingresa tu nueva contraseña</p>
      </div>

      {/* Formulario de Nueva Contraseña */}
      <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
        {resetPasswordError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{resetPasswordError}</span>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Lock className="w-4 h-4 inline mr-2" />
            Nueva contraseña
          </label>
          <input
            type="password"
            value={resetPasswordData.newPassword}
            onChange={(e) => {
              setResetPasswordData({...resetPasswordData, newPassword: e.target.value});
              if (resetPasswordError) setResetPasswordError('');
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
            placeholder="Ingresa tu nueva contraseña"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Lock className="w-4 h-4 inline mr-2" />
            Confirmar nueva contraseña
          </label>
          <input
            type="password"
            value={resetPasswordData.confirmPassword}
            onChange={(e) => {
              setResetPasswordData({...resetPasswordData, confirmPassword: e.target.value});
              if (resetPasswordError) setResetPasswordError('');
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
            placeholder="Confirma tu nueva contraseña"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all"
        >
          Actualizar contraseña
        </button>
      </form>
    </div>
  );

  const renderRegister = () => (
    <div>
      {/* Header con botón de regreso */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => setCurrentView('login')}
          className="mr-3 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center flex-1">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-2">
            <Bus className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Regístrate</h1>
          <p className="text-sm text-gray-600">Únete a SMARTBUS</p>
        </div>
      </div>

      {/* Formulario de Registro */}
      <form onSubmit={handleRegisterSubmit} className="space-y-4">
        {/* Nombres */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <User className="w-4 h-4 inline mr-1" />
            Nombres <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={registerData.nombres}
            onChange={(e) => {
              setRegisterData({...registerData, nombres: e.target.value});
              if (registerErrors.includes('nombres')) {
                setRegisterErrors(registerErrors.filter(err => err !== 'nombres'));
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Ingresa tus nombres"
          />
          {registerErrors.includes('nombres') && (
            <p className="text-red-500 text-xs mt-1">Complete el campo</p>
          )}
        </div>

        {/* Apellidos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <User className="w-4 h-4 inline mr-1" />
            Apellidos <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={registerData.apellidos}
            onChange={(e) => {
              setRegisterData({...registerData, apellidos: e.target.value});
              if (registerErrors.includes('apellidos')) {
                setRegisterErrors(registerErrors.filter(err => err !== 'apellidos'));
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Ingresa tus apellidos"
          />
          {registerErrors.includes('apellidos') && (
            <p className="text-red-500 text-xs mt-1">Complete el campo</p>
          )}
        </div>

        {/* Correo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Mail className="w-4 h-4 inline mr-1" />
            Correo electrónico <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={registerData.correo}
            onChange={(e) => {
              setRegisterData({...registerData, correo: e.target.value});
              if (registerErrors.includes('correo')) {
                setRegisterErrors(registerErrors.filter(err => err !== 'correo'));
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="ejemplo@correo.com"
          />
          {registerErrors.includes('correo') && (
            <p className="text-red-500 text-xs mt-1">Complete el campo</p>
          )}
        </div>

        {/* Celular */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Phone className="w-4 h-4 inline mr-1" />
            Celular <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={registerData.celular}
            onChange={(e) => {
              setRegisterData({...registerData, celular: e.target.value});
              if (registerErrors.includes('celular')) {
                setRegisterErrors(registerErrors.filter(err => err !== 'celular'));
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="809-123-4567"
          />
          {registerErrors.includes('celular') && (
            <p className="text-red-500 text-xs mt-1">Complete el campo</p>
          )}
        </div>

        {/* Usuario */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <User className="w-4 h-4 inline mr-1" />
            Usuario <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={registerData.usuario}
            onChange={(e) => {
              setRegisterData({...registerData, usuario: e.target.value});
              if (registerErrors.includes('usuario')) {
                setRegisterErrors(registerErrors.filter(err => err !== 'usuario'));
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Elige tu nombre de usuario"
          />
          {registerErrors.includes('usuario') && (
            <p className="text-red-500 text-xs mt-1">Complete el campo</p>
          )}
        </div>

        {/* Contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Lock className="w-4 h-4 inline mr-1" />
            Contraseña <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={registerData.contraseña}
            onChange={(e) => {
              setRegisterData({...registerData, contraseña: e.target.value});
              if (registerErrors.includes('contraseña')) {
                setRegisterErrors(registerErrors.filter(err => err !== 'contraseña'));
              }
              if (passwordMismatchError) {
                setPasswordMismatchError('');
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Crea una contraseña segura"
          />
          {registerErrors.includes('contraseña') && (
            <p className="text-red-500 text-xs mt-1">Complete el campo</p>
          )}
        </div>

        {/* Confirmar Contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Lock className="w-4 h-4 inline mr-1" />
            Confirmar contraseña <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={registerData.confirmarContraseña}
            onChange={(e) => {
              setRegisterData({...registerData, confirmarContraseña: e.target.value});
              if (registerErrors.includes('confirmar contraseña')) {
                setRegisterErrors(registerErrors.filter(err => err !== 'confirmar contraseña'));
              }
              if (passwordMismatchError) {
                setPasswordMismatchError('');
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Confirma tu contraseña"
          />
          {registerErrors.includes('confirmar contraseña') && (
            <p className="text-red-500 text-xs mt-1">Complete el campo</p>
          )}
          {passwordMismatchError && (
            <p className="text-red-500 text-xs mt-1">{passwordMismatchError}</p>
          )}
        </div>

        {/* Mensaje de error general */}
        {registerErrors.length > 1 && (
          <div className="text-red-500 text-sm text-center">
            Complete los campos
          </div>
        )}

        {/* Botón de Registro */}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all mt-6 mx-auto block"
        >
          Registrar
        </button>
      </form>
    </div>
  );
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8">
          {currentView === 'login' && renderLogin()}
          {currentView === 'register' && renderRegister()}
          {currentView === 'forgot-password' && renderForgotPassword()}
          {currentView === 'reset-password' && renderResetPassword()}
        </div>
      </div>
    </div>
  );
};

export default Login;