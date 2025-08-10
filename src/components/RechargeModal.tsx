import React, { useState } from 'react';
import { X, CreditCard, Smartphone, QrCode, ArrowLeft, User, Phone, Mail, AlertCircle } from 'lucide-react';
import { Route } from '../types';
import { useAuth } from '../context/AuthContext';
import PayPalModal from './PayPalModal';

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRoute: Route | null;
}

type PaymentStep = 'methods' | 'mobile' | 'paypal';

const RechargeModal: React.FC<RechargeModalProps> = ({ isOpen, onClose, selectedRoute }) => {
  const [currentStep, setCurrentStep] = useState<PaymentStep>('methods');
  const [amount, setAmount] = useState('50');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('tu-email@paypal.com');
  const { addTransaction } = useAuth();
  const [isPayPalModalOpen, setIsPayPalModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState('50');
  const [mobilePaymentError, setMobilePaymentError] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    // Reset form when closing
    setCurrentStep('methods');
    setAmount('50');
    setFullName('');
    setPhone('');
    setEmail('tu-email@paypal.com');
    setMobilePaymentError('');
    setSelectedAmount('50');
  };

  const handleBackToMethods = () => {
    setCurrentStep('methods');
    setMobilePaymentError('');
  };

  const handleMobilePayment = () => {
    // Validar que el monto sea válido antes de cambiar de paso
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Por favor ingresa un monto válido');
      return;
    }
    setCurrentStep('mobile');
  };

  const handlePayPalPayment = () => {
    // Validar que el monto sea válido antes de cambiar de paso
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Por favor ingresa un monto válido');
      return;
    }
    setSelectedAmount(amount);
    setIsPayPalModalOpen(true);
  };

  const handleMobilePaymentSubmit = () => {
    setMobilePaymentError('');
    
    // Validación adicional antes del pago
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setMobilePaymentError('Por favor ingresa un monto válido');
      return;
    }
    if (!fullName.trim()) {
      setMobilePaymentError('Por favor ingresa tu nombre completo');
      return;
    }
    if (!phone.trim()) {
      setMobilePaymentError('Por favor ingresa tu número de teléfono');
      return;
    }
    
    // Validar formato de teléfono dominicano
    const phoneRegex = /^(809|829|849)-?\d{3}-?\d{4}$/;
    const cleanPhone = phone.replace(/\s/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      setMobilePaymentError('Formato de teléfono inválido. Usa: 809-123-4567');
      return;
    }
    
    addTransaction(amountNum, 'mobile', 'RD$');
    alert(`¡Pago Móvil procesado exitosamente! 🎉\n\n💰 Monto: RD$ ${amountNum.toLocaleString('es-DO')}\n📱 Método: Pago Móvil RD\n📞 Teléfono: ${phone}\n\n🎫 Código QR generado para el autobús`);
    handleClose();
  };

  const handlePayPalPaymentComplete = (rdAmount: number) => {
    addTransaction(rdAmount, 'paypal', 'USD');
    setIsPayPalModalOpen(false);
    handleClose();
  };

  const renderMethodsStep = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recargar Saldo</h2>
        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      {selectedRoute && (
        <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: selectedRoute.color }}
            />
            <h3 className="font-semibold text-gray-900 dark:text-white">{selectedRoute.name}</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Recarga tu saldo para usar el transporte</p>
        </div>
      )}

      {/* Selección de monto */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Monto a recargar:</h3>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">RD$</span>
          <input
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
            placeholder="50"
            inputMode="numeric"
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Equivale a USD ${(parseFloat(amount || '0') * 0.017).toFixed(2)}
        </p>
      </div>

      <div className="space-y-3 mb-6">
        <h3 className="font-semibold text-gray-900 dark:text-white">Método de pago:</h3>
        
        <button
          onClick={handleMobilePayment}
          disabled={!amount || parseFloat(amount) <= 0}
          className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Pago Móvil (RD)</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Para dominicanos</div>
            </div>
          </div>
        </button>

        <button
          onClick={handlePayPalPayment}
          disabled={!amount || parseFloat(amount) <= 0}
          className="w-full p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">PayPal (Internacional)</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Para visitantes extranjeros</div>
            </div>
          </div>
        </button>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-2 mb-2">
          <QrCode className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="font-medium text-blue-900 dark:text-blue-300">Sistema de Código QR</span>
        </div>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Si tienes saldo disponible, dirigete a "QR y Saldo". De lo contrario recarga para visualizar el código QR.
        </p>
      </div>
    </div>
  );

  const renderMobileStep = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={handleBackToMethods} className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pago Móvil RD</h2>
        </div>
        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Error Message */}
        {mobilePaymentError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{mobilePaymentError}</span>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Monto de Recarga
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">RD$</span>
            <input
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="50"
              inputMode="numeric"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nombre Completo
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (mobilePaymentError) setMobilePaymentError('');
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tu nombre completo"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Número de Teléfono *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (mobilePaymentError) setMobilePaymentError('');
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="809-123-4567"
              maxLength={12}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Formato: 809-123-4567, 829-123-4567, 849-123-4567
          </p>
        </div>

        <button
          onClick={handleMobilePaymentSubmit}
          disabled={!amount || !fullName.trim() || !phone.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          💳 Pagar RD$ {parseFloat(amount || '0').toLocaleString('es-DO')}
        </button>
        
        <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-1">
            <Smartphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-300">Pago Móvil Seguro</span>
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Tu pago será procesado de forma segura a través del sistema bancario dominicano.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4 sm:p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto mx-4">
          {currentStep === 'methods' && renderMethodsStep()}
          {currentStep === 'mobile' && renderMobileStep()}
        </div>
      </div>
      
      <PayPalModal
        isOpen={isPayPalModalOpen}
        onClose={() => setIsPayPalModalOpen(false)}
        amount={selectedAmount}
        onPaymentComplete={handlePayPalPaymentComplete}
      />
    </>
  );
};

export default RechargeModal;