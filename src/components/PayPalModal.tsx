import React, { useState } from 'react';
import { X, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';

interface PayPalModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
  onPaymentComplete: (amount: number) => void;
}

type PayPalStep = 'login' | 'dashboard' | 'payment-confirm';

type PayPalView = 'login' | 'register' | 'forgot-password' | 'dashboard';

const PayPalModal: React.FC<PayPalModalProps> = ({ isOpen, onClose, amount, onPaymentComplete }) => {
  const [currentView, setCurrentView] = useState<PayPalView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', email: '', balance: 0 });
  
  // Estados para registro
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [registerError, setRegisterError] = useState('');
  
  // Estados para recuperación de contraseña
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  
  // Estados para reseteo de contraseña
  const [resetPasswordData, setResetPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [resetPasswordError, setResetPasswordError] = useState('');

  const usdAmount = (parseFloat(amount) * 0.017).toFixed(2);

  // Función para obtener usuarios de PayPal (incluye predefinidos y registrados)
  const getPayPalUsers = () => {
    const defaultUsers = [
      { email: 'usuario@paypal.com', password: '1234', name: 'Usuario Demo', balance: 1000 },
      { email: 'test@gmail.com', password: 'test', name: 'Test User', balance: 1000 },
      { email: 'demo@hotmail.com', password: 'demo', name: 'Demo User', balance: 1000 }
    ];
    
    const registeredUsers = JSON.parse(localStorage.getItem('paypal_registered_users') || '[]');
    return [...defaultUsers, ...registeredUsers];
  };

  // Función para guardar un nuevo usuario registrado
  const saveRegisteredUser = (userData: any) => {
    const registeredUsers = JSON.parse(localStorage.getItem('paypal_registered_users') || '[]');
    registeredUsers.push(userData);
    localStorage.setItem('paypal_registered_users', JSON.stringify(registeredUsers));
  };

  // Función para actualizar el saldo de un usuario
  const updateUserBalance = (email: string, newBalance: number) => {
    // Actualizar en usuarios registrados
    const registeredUsers = JSON.parse(localStorage.getItem('paypal_registered_users') || '[]');
    const userIndex = registeredUsers.findIndex((u: any) => u.email === email);
    if (userIndex !== -1) {
      registeredUsers[userIndex].balance = newBalance;
      localStorage.setItem('paypal_registered_users', JSON.stringify(registeredUsers));
    }
  };
  const handleLogin = async () => {
    // Limpiar errores previos
    setLoginError('');
    
    // Validaciones
    if (!email || !password) {
      setLoginError('Por favor completa todos los campos');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLoginError('Por favor ingresa un correo electrónico válido');
      return;
    }

    // Validar longitud de contraseña
    if (password.length < 4) {
      setLoginError('La contraseña debe tener al menos 4 caracteres');
      return;
    }

    setIsLoading(true);
    
    // Simular proceso de login con validación
    setTimeout(() => {
      // Obtener todos los usuarios (predefinidos + registrados)
      const validUsers = getPayPalUsers();

      const user = validUsers.find(u => u.email === email && u.password === password);

      if (user) {
        // Login exitoso
        setUserInfo({
          name: user.name,
          email: user.email,
          balance: user.balance
        });
        
        // Guardar datos en localStorage para persistencia
        localStorage.setItem('paypal_user', JSON.stringify({
          name: user.name,
          email: user.email,
          balance: user.balance,
          loginTime: new Date().toISOString()
        }));
        
        setCurrentView('dashboard');
        setLoginError('');
      } else {
        // Login fallido
        setLoginError('Correo electrónico o contraseña incorrectos');
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  // Cargar datos guardados al abrir el modal
  React.useEffect(() => {
    if (isOpen && currentView === 'login') {
      // Resetear solo la sesión actual al abrir, mantener usuarios registrados
      localStorage.removeItem('paypal_user');
      
      const savedUser = localStorage.getItem('paypal_user');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          // Verificar si la sesión no es muy antigua (24 horas)
          const loginTime = new Date(userData.loginTime);
          const now = new Date();
          const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
          
          if (hoursDiff < 24) {
            setUserInfo({
              name: userData.name,
              email: userData.email,
              balance: userData.balance
            });
            setCurrentView('dashboard');
          } else {
            // Sesión expirada, limpiar datos
            localStorage.removeItem('paypal_user');
          }
        } catch (error) {
          localStorage.removeItem('paypal_user');
        }
      }
    }
  }, [isOpen, currentView]);

  if (!isOpen) return null;

  const handlePayment = () => {
    const usdAmountNum = parseFloat(usdAmount);
    if (userInfo.balance < usdAmountNum) {
      alert('Saldo insuficiente en tu cuenta de PayPal');
      return;
    }

    // Procesar pago y restar del saldo
    const newBalance = userInfo.balance - usdAmountNum;
    
    // Actualizar saldo en el estado local
    setUserInfo(prev => ({ ...prev, balance: newBalance }));
    
    // Actualizar saldo en localStorage para persistencia
    const savedUser = JSON.parse(localStorage.getItem('paypal_user') || '{}');
    savedUser.balance = newBalance;
    localStorage.setItem('paypal_user', JSON.stringify(savedUser));
    
    // Actualizar saldo del usuario en la base de datos
    updateUserBalance(userInfo.email, newBalance);
    
    onPaymentComplete(parseFloat(amount));
    alert(`¡Pago PayPal completado! 🎉\n\n💰 Monto: USD $${usdAmount} (RD$ ${parseFloat(amount).toLocaleString('es-DO')})\n💳 Saldo restante: USD $${newBalance.toLocaleString('en-US')}\n\n🎫 Código QR generado para el autobús`);
    handleClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('paypal_user');
    setUserInfo({ name: '', email: '', balance: 0 });
    setCurrentView('login');
    setEmail('');
    setPassword('');
    setLoginError('');
  };

  const handleRegister = () => {
    setRegisterError('');
    
    // Validar campos requeridos
    if (!registerData.firstName.trim() || !registerData.lastName.trim() || 
        !registerData.email.trim() || !registerData.password.trim() || 
        !registerData.confirmPassword.trim()) {
      setRegisterError('Por favor completa todos los campos');
      return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
      setRegisterError('Por favor ingresa un correo electrónico válido');
      return;
    }
    
    // Validar longitud de contraseña
    if (registerData.password.length < 6) {
      setRegisterError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    // Validar que las contraseñas coincidan
    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError('Las contraseñas no coinciden');
      return;
    }
    
    // Verificar si el email ya existe
    const existingUsers = getPayPalUsers();
    if (existingUsers.some(user => user.email.toLowerCase() === registerData.email.toLowerCase())) {
      setRegisterError('Ya existe una cuenta con este correo electrónico');
      return;
    }
    
    // Crear nuevo usuario
    const newUser = {
      email: registerData.email,
      password: registerData.password,
      name: `${registerData.firstName} ${registerData.lastName}`,
      balance: 1000 // Saldo inicial de $1,000 USD
    };
    
    // Guardar usuario registrado
    saveRegisteredUser(newUser);
    
    // Mostrar mensaje de éxito
    alert(`¡Cuenta de PayPal creada exitosamente! 🎉\n\n👤 Usuario: ${registerData.email}\n💰 Saldo inicial: USD $1,000\n\n✅ Ya puedes iniciar sesión con tus credenciales.`);
    
    // Limpiar formulario y volver al login
    setRegisterData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setCurrentView('login');
  };
  
  const handleForgotPassword = () => {
    setForgotError('');
    
    // Validar email
    if (!forgotEmail.trim()) {
      setForgotError('Por favor ingresa tu correo electrónico');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail)) {
      setForgotError('Por favor ingresa un correo válido');
      return;
    }
    
    // Simular envío de correo (igual que en el login principal)
    alert(`Se ha enviado un enlace de recuperación a: ${forgotEmail}\n\nEn un entorno real, recibirías un correo con un enlace para restablecer tu contraseña.`);
    
    // Simular que el usuario hace clic en el enlace del correo
    setTimeout(() => {
      setCurrentView('reset-password');
    }, 1000);
  };
  
  const handleResetPassword = () => {
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
    
    if (resetPasswordData.newPassword.length < 6) {
      setResetPasswordError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    // Simular actualización de contraseña
    alert('¡Contraseña de PayPal actualizada exitosamente!\n\nYa puedes iniciar sesión con tu nueva contraseña.');
    
    // Limpiar formulario y volver al login
    setResetPasswordData({ newPassword: '', confirmPassword: '' });
    setForgotEmail('');
    setCurrentView('login');
  };
  
  // Limpiar formulario al cerrar (igual que en login principal)
  const handleClose = () => {
    onClose();
    setEmail('');
    setPassword('');
    setLoginError('');
    setCurrentView('login');
    setRegisterData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setRegisterError('');
    setForgotEmail('');
    setForgotError('');
    setResetPasswordData({ newPassword: '', confirmPassword: '' });
    setResetPasswordError('');
  };

  const renderLogin = () => (
    <div className="min-h-[600px] bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Secure</span>
          <span className="text-sm text-gray-500">https://www.sandbox.paypal.com/webapps/auth</span>
        </div>
        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* PayPal Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* PayPal Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-1">
            <div className="bg-blue-600 text-white px-2 py-1 rounded text-lg font-bold">Pay</div>
            <div className="bg-blue-400 text-white px-2 py-1 rounded text-lg font-bold">Pal</div>
          </div>
        </div>

        <h1 className="text-2xl font-normal text-gray-800 mb-8">Iniciar sesión con PayPal</h1>
        {/* Login Form */}
        <div className="w-full max-w-sm space-y-4">
          {/* Error Message */}
          {loginError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{loginError}</span>
            </div>
          )}

          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              placeholder="Dirección de correo electrónico"
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base pr-12"
              placeholder="Contraseña"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading || !email || !password}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setCurrentView('forgot-password')} 
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              ¿Problemas para iniciar sesión?
            </button>
          </div>
        </div>

        {/* Sign Up Button */}
        <div className="w-full max-w-sm mt-8">
          <button
            type="button"
            onClick={() => setCurrentView('register')}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded font-medium transition-colors"
          >
            Registrarse
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-gray-500 space-y-1">
          <div className="flex items-center justify-center gap-4">
            <a href="#" className="hover:text-gray-700">Privacidad</a>
            <a href="#" className="hover:text-gray-700">PayPal</a>
          </div>
          <p>Copyright © 1999-2024 PayPal. Todos los derechos reservados.</p>
          
          {/* Credenciales de prueba */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-2">Credenciales de prueba:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Email:</strong> usuario@paypal.com | <strong>Contraseña:</strong> 1234</p>
              <p><strong>Email:</strong> test@gmail.com | <strong>Contraseña:</strong> test</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRegister = () => (
    <div className="min-h-[600px] bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Secure</span>
          <span className="text-sm text-gray-500">https://www.sandbox.paypal.com/webapps/auth</span>
        </div>
        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* PayPal Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* Back Button */}
        <div className="w-full max-w-sm mb-4">
          <button
            type="button"
            onClick={() => setCurrentView('login')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio de sesión
          </button>
        </div>

        {/* PayPal Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-1">
            <div className="bg-blue-600 text-white px-2 py-1 rounded text-lg font-bold">Pay</div>
            <div className="bg-blue-400 text-white px-2 py-1 rounded text-lg font-bold">Pal</div>
          </div>
        </div>

        <h1 className="text-2xl font-normal text-gray-800 mb-8">Crear cuenta de PayPal</h1>
        
        {/* Register Form */}
        <div className="w-full max-w-sm space-y-4">
          {/* Error Message */}
          {registerError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{registerError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={registerData.firstName}
              onChange={(e) => {
                setRegisterData({...registerData, firstName: e.target.value});
                if (registerError) setRegisterError('');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              placeholder="Nombre"
            />
            <input
              type="text"
              value={registerData.lastName}
              onChange={(e) => {
                setRegisterData({...registerData, lastName: e.target.value});
                if (registerError) setRegisterError('');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              placeholder="Apellido"
            />
          </div>

          <input
            type="email"
            value={registerData.email}
            onChange={(e) => {
              setRegisterData({...registerData, email: e.target.value});
              if (registerError) setRegisterError('');
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            placeholder="Dirección de correo electrónico"
          />

          <input
            type="password"
            value={registerData.password}
            onChange={(e) => {
              setRegisterData({...registerData, password: e.target.value});
              if (registerError) setRegisterError('');
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            placeholder="Contraseña"
          />

          <input
            type="password"
            value={registerData.confirmPassword}
            onChange={(e) => {
              setRegisterData({...registerData, confirmPassword: e.target.value});
              if (registerError) setRegisterError('');
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            placeholder="Confirmar contraseña"
          />

          <button
            onClick={handleRegister}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded font-medium transition-colors"
          >
            Crear cuenta
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setCurrentView('login')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              ¿Ya tienes cuenta? Iniciar sesión
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-gray-500 space-y-1">
          <div className="flex items-center justify-center gap-4">
            <a href="#" className="hover:text-gray-700">Privacidad</a>
            <a href="#" className="hover:text-gray-700">PayPal</a>
          </div>
          <p>Copyright © 1999-2024 PayPal. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );

  const renderForgotPassword = () => (
    <div className="min-h-[600px] bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Secure</span>
          <span className="text-sm text-gray-500">https://www.sandbox.paypal.com/webapps/auth</span>
        </div>
        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* PayPal Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* Back Button */}
        <div className="w-full max-w-sm mb-4">
          <button
            type="button"
            onClick={() => setCurrentView('login')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio de sesión
          </button>
        </div>

        {/* PayPal Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-1">
            <div className="bg-blue-600 text-white px-2 py-1 rounded text-lg font-bold">Pay</div>
            <div className="bg-blue-400 text-white px-2 py-1 rounded text-lg font-bold">Pal</div>
          </div>
        </div>

        <h1 className="text-2xl font-normal text-gray-800 mb-4">¿Problemas para iniciar sesión?</h1>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          Ingresa tu dirección de correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>
        
        {/* Forgot Password Form */}
        <div className="w-full max-w-sm space-y-4">
          {/* Error Message */}
          {forgotError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{forgotError}</span>
            </div>
          )}

          <input
            type="email"
            value={forgotEmail}
            onChange={(e) => {
              setForgotEmail(e.target.value);
              if (forgotError) setForgotError('');
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            placeholder="Dirección de correo electrónico"
          />

          <button
            onClick={handleForgotPassword}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded font-medium transition-colors"
          >
            Enviar enlace
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setCurrentView('login')}
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Volver al inicio de sesión
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-gray-500 space-y-1">
          <div className="flex items-center justify-center gap-4">
            <a href="#" className="hover:text-gray-700">Privacidad</a>
            <a href="#" className="hover:text-gray-700">PayPal</a>
          </div>
          <p>Copyright © 1999-2024 PayPal. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );

  const renderResetPassword = () => (
    <div className="min-h-[600px] bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Secure</span>
          <span className="text-sm text-gray-500">https://www.sandbox.paypal.com/webapps/auth</span>
        </div>
        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* PayPal Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* PayPal Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-1">
            <div className="bg-blue-600 text-white px-2 py-1 rounded text-lg font-bold">Pay</div>
            <div className="bg-blue-400 text-white px-2 py-1 rounded text-lg font-bold">Pal</div>
          </div>
        </div>

        <h1 className="text-2xl font-normal text-gray-800 mb-4">Nueva Contraseña</h1>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          Ingresa tu nueva contraseña para tu cuenta de PayPal.
        </p>
        
        {/* Reset Password Form */}
        <div className="w-full max-w-sm space-y-4">
          {/* Error Message */}
          {resetPasswordError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{resetPasswordError}</span>
            </div>
          )}

          <input
            type="password"
            value={resetPasswordData.newPassword}
            onChange={(e) => {
              setResetPasswordData({...resetPasswordData, newPassword: e.target.value});
              if (resetPasswordError) setResetPasswordError('');
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            placeholder="Nueva contraseña"
          />

          <input
            type="password"
            value={resetPasswordData.confirmPassword}
            onChange={(e) => {
              setResetPasswordData({...resetPasswordData, confirmPassword: e.target.value});
              if (resetPasswordError) setResetPasswordError('');
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            placeholder="Confirmar nueva contraseña"
          />

          <button
            onClick={handleResetPassword}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded font-medium transition-colors"
          >
            Actualizar contraseña
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setCurrentView('login')}
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Volver al inicio de sesión
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-gray-500 space-y-1">
          <div className="flex items-center justify-center gap-4">
            <a href="#" className="hover:text-gray-700">Privacidad</a>
            <a href="#" className="hover:text-gray-700">PayPal</a>
          </div>
          <p>Copyright © 1999-2024 PayPal. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="min-h-[600px] bg-white flex flex-col max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center justify-between max-w-xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="bg-white text-blue-600 px-2 py-1 rounded text-base font-bold">Pay</div>
              <div className="bg-blue-400 text-white px-2 py-1 rounded text-base font-bold">Pal</div>
            </div>
            <nav className="flex gap-4 text-sm">
              <button className="hover:text-blue-200 border-b-2 border-white pb-1 px-3">Resumen</button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md hover:shadow-lg"
            >
              Cerrar sesión
            </button>
            <button onClick={handleClose} className="text-white hover:text-blue-200">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* User Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-6">
        <div className="flex items-center justify-between max-w-xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {userInfo.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-light">¡Hola, {userInfo.name}!</h2>
              <p className="text-blue-100 text-sm flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Cuenta verificada
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-light">USD ${userInfo.balance.toLocaleString('en-US')}</div>
            <p className="text-blue-100 text-sm">Saldo disponible</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-4">
        <div className="max-w-xl mx-auto">
          {/* Payment Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-600 rounded text-white flex items-center justify-center text-xs font-bold">
                  S
                </div>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-800">SMARTBUS</h3>
                <p className="text-gray-600 text-sm">Recarga de saldo de transporte</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Monto a pagar</div>
                  <div className="text-lg font-bold text-gray-900">USD ${usdAmount}</div>
                  <div className="text-sm text-gray-500">Equivale a RD$ {amount}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">Método de pago</div>
                  <div className="text-sm font-semibold text-gray-900">Saldo de PayPal</div>
                  <div className="text-sm text-green-600">USD ${userInfo.balance.toLocaleString('en-US')} disponible</div>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={userInfo.balance < parseFloat(usdAmount)}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              {userInfo.balance < parseFloat(usdAmount) ? 'Saldo insuficiente' : `Pagar USD $${usdAmount}`}
            </button>

            {userInfo.balance < parseFloat(usdAmount) && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">
                  <strong>Saldo insuficiente:</strong> Necesitas USD ${(parseFloat(usdAmount) - userInfo.balance).toLocaleString('en-US')} adicionales para completar esta transacción.
                </p>
              </div>
            )}

            <p className="text-center text-xs text-gray-500 mt-3">
              Al hacer clic en "Pagar", aceptas el <a href="#" className="text-blue-600 underline">User Agreement</a> y la <a href="#" className="text-blue-600 underline">Privacy Policy</a> de PayPal.
            </p>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Actividad reciente</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-5 h-5 bg-green-600 rounded text-white flex items-center justify-center text-xs">+</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Recarga SMARTBUS</div>
                    <div className="text-sm text-gray-600">Hace 2 días</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">-USD $15.30</div>
                  <div className="text-sm text-green-600">Completado</div>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-5 h-5 bg-blue-600 rounded text-white flex items-center justify-center text-xs">$</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Recarga desde tarjeta</div>
                    <div className="text-sm text-gray-600">Hace 1 semana</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">+USD $100.00</div>
                  <div className="text-sm text-green-600">Completado</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 border-t border-gray-200 px-4 py-3">
        <div className="max-w-xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-800">Help</a>
            <a href="#" className="hover:text-gray-800">Contact</a>
            <a href="#" className="hover:text-gray-800">Fees</a>
            <a href="#" className="hover:text-gray-800">Security</a>
            <a href="#" className="hover:text-gray-800">Apps</a>
          </div>
          <div className="text-center text-xs text-gray-500 mt-1">
            Copyright © 1999-2024 PayPal. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {currentView === 'login' && renderLogin()}
        {currentView === 'register' && renderRegister()}
        {currentView === 'forgot-password' && renderForgotPassword()}
        {currentView === 'reset-password' && renderResetPassword()}
        {currentView === 'dashboard' && renderDashboard()}
      </div>
    </div>
  );
};

export default PayPalModal;