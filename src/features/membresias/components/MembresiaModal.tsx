// src/features/membresias/components/MembresiaModal.tsx
import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Calendar, CreditCard } from 'lucide-react';
import type { Alumno } from '../../alumnos/types/alumnosTypes';
import type { PlanMembresiaResponse } from '../types/membresiasTypes';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import membresiasService from '../services/membresiaService';
import planesService from '../../planesMembresia/services/PlanesService';
import { formatearFecha, formatearFechaLarga } from '../../../lib/membresiasUtils';

interface MembresiasModalProps {
  alumno: Alumno | null;
  onClose: () => void;
  onSuccess: () => void;
}

type FlowStep = 'loading' | 'sin-membresia' | 'con-membresia' | 'seleccionar-plan' | 'confirmar';

export const MembresiasModal: React.FC<MembresiasModalProps> = ({
  alumno,
  onClose,
  onSuccess
}) => {
  // Estados
  const [step, setStep] = useState<FlowStep>('loading');
  const [planes, setPlanes] = useState<PlanMembresiaResponse[]>([]);
  const [planSeleccionado, setPlanSeleccionado] = useState<PlanMembresiaResponse | null>(null);
  const [membresiaActual, setMembresiaActual] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    if (alumno) {
      cargarDatosIniciales();
    }
  }, [alumno]);

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar planes y membresía activa en paralelo
      const [planesData, membresiaData] = await Promise.all([
        planesService.obtenerTodos(),
        membresiasService.obtenerActivaPorAlumno(alumno!.alumno_id)
      ]);

      setPlanes(planesData);

      // Determinar el flujo según si tiene o no membresía activa
      if (membresiaData) {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const [year, month, day] = membresiaData.fecha_fin.split('T')[0].split('-').map(Number);
        const fechaFin = new Date(year, month - 1, day, 0, 0, 0, 0);
        
        // Verificar si realmente está activa (no vencida)
        if (fechaFin >= hoy) {
          setMembresiaActual(membresiaData);
          setStep('con-membresia');
        } else {
          // La membresía está marcada como activa pero ya venció
          setMembresiaActual(null);
          setStep('sin-membresia');
        }
      } else {
        setMembresiaActual(null);
        setStep('sin-membresia');
      }
    } catch (err: any) {
      console.error('Error al cargar datos:', err);
      
      // ✅ Manejo especial para el error de renovación programada
      if (err.response?.status === 400 && err.response?.data?.membresiaProgramada) {
        setError('Ya tienes una renovación programada. No puedes programar otra hasta que esta inicie.');
      } else {
        setError('Error al cargar la información de membresías');
      }
      
      setStep('sin-membresia');
    } finally {
      setLoading(false);
    }
  };

  // Handler para seleccionar plan (flujo sin membresía)
  const handleSeleccionarPlan = (plan: PlanMembresiaResponse) => {
    setPlanSeleccionado(plan);
    setStep('confirmar');
  };

  // Handler para renovar con el mismo plan
  const handleRenovarMismoPlan = () => {
    if (membresiaActual) {
      setPlanSeleccionado(membresiaActual.plan);
      setStep('confirmar');
    }
  };

  // Handler para cambiar de plan
  const handleCambiarPlan = () => {
    setStep('seleccionar-plan');
  };

  // Handler para confirmar la asignación/renovación
  const handleConfirmar = async () => {
    if (!planSeleccionado || !alumno) return;

    try {
      setLoading(true);
      setError(null);

      // Usar el endpoint de renovar que tiene la lógica corregida
      await membresiasService.renovar({
        alumno_id: alumno.alumno_id,
        plan_id: planSeleccionado.plan_id
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error al asignar membresía:', err);
      
      // ✅ Manejo especial para renovación programada ya existente
      if (err.response?.status === 400 && err.response?.data?.message?.includes('renovación programada')) {
        setError('Ya tienes una renovación programada. No puedes programar otra hasta que esta inicie.');
      } else {
        setError(err.response?.data?.message || 'Error al asignar la membresía');
      }
    } finally {
      setLoading(false);
    }
  };

  const calcularFechaInicio = (): string => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    if (!membresiaActual) {
      // Sin membresía: inicia hoy
      return formatearFechaLarga(hoy.toISOString());
    }

    // ✅ Parsear fecha_fin correctamente sin desfase UTC
    const [year, month, day] = membresiaActual.fecha_fin.split('T')[0].split('-').map(Number);
    const fechaFin = new Date(year, month - 1, day, 0, 0, 0, 0);
    
    if (fechaFin < hoy) {
      // Membresía vencida: inicia hoy
      return formatearFechaLarga(hoy.toISOString());
    }

    // Membresía activa: inicia fecha_fin + 1
    const fechaInicio = new Date(fechaFin);
    fechaInicio.setDate(fechaInicio.getDate() + 1);
    return formatearFechaLarga(fechaInicio.toISOString());
  };

  const calcularFechaFin = (): string => {
    if (!planSeleccionado) return '';

    // Obtener fecha inicio parseada correctamente
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    let fechaInicio: Date;
    
    if (!membresiaActual) {
      fechaInicio = hoy;
    } else {
      // ✅ Parsear fecha_fin correctamente sin desfase UTC
      const [year, month, day] = membresiaActual.fecha_fin.split('T')[0].split('-').map(Number);
      const fechaFin = new Date(year, month - 1, day, 0, 0, 0, 0);
      
      if (fechaFin < hoy) {
        fechaInicio = hoy;
      } else {
        fechaInicio = new Date(fechaFin);
        fechaInicio.setDate(fechaInicio.getDate() + 1);
      }
    }

    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + planSeleccionado.duracion_dias);

    return formatearFechaLarga(fechaFin.toISOString());
  };

  if (!alumno) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={loading ? undefined : onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm px-6 py-4 border-b border-slate-700 flex justify-between items-center z-10">
          <div>
            <h2 className="text-xl font-bold text-white">Gestión de Membresía</h2>
            <p className="text-sm text-gray-400 mt-1">{alumno.nombre_completo}</p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-gray-400 hover:text-white disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Loading State */}
          {step === 'loading' && (
            <div className="flex flex-col items-center justify-center py-12">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-400">Cargando información...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Flujo 1: Sin Membresía */}
          {step === 'sin-membresia' && (
            <div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-blue-400 font-medium">Sin membresía activa</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Selecciona un plan para asignar una membresía. La fecha de inicio será hoy.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-4">Planes Disponibles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {planes.map((plan) => (
                  <div
                    key={plan.plan_id}
                    className="bg-slate-700/40 border border-slate-600 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer"
                    onClick={() => handleSeleccionarPlan(plan)}
                  >
                    <h4 className="font-semibold text-white">{plan.nombre}</h4>
                    {plan.descripcion && (
                      <p className="text-sm text-gray-400 mt-1">{plan.descripcion}</p>
                    )}
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-2xl font-bold text-blue-400">
                        ${plan.precio.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-400">
                        {plan.duracion_dias} días
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Flujo 2: Con Membresía Activa */}
          {step === 'con-membresia' && membresiaActual && (
            <div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-green-400 font-medium">Membresía activa</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Plan actual: <span className="text-white font-medium">{membresiaActual.plan.nombre}</span>
                    </p>
                    <p className="text-gray-400 text-sm">
                      Vence el: <span className="text-white font-medium">
                        {formatearFecha(membresiaActual.fecha_fin)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-4">¿Qué deseas hacer?</h3>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  className="w-full justify-center"
                  onClick={handleRenovarMismoPlan}
                  icon={<CheckCircle className="w-5 h-5" />}
                >
                  Renovar con el mismo plan ({membresiaActual.plan.nombre})
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-center"
                  onClick={handleCambiarPlan}
                  icon={<CreditCard className="w-5 h-5" />}
                >
                  Cambiar a otro plan
                </Button>
              </div>
            </div>
          )}

          {/* Flujo 3: Seleccionar Otro Plan */}
          {step === 'seleccionar-plan' && (
            <div>
              <button
                onClick={() => setStep('con-membresia')}
                className="text-blue-400 hover:text-blue-300 text-sm mb-4 flex items-center gap-2"
              >
                ← Volver
              </button>

              <h3 className="text-lg font-semibold text-white mb-4">Selecciona un plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {planes.map((plan) => (
                  <div
                    key={plan.plan_id}
                    className={`bg-slate-700/40 border rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer ${
                      plan.plan_id === membresiaActual?.plan.plan_id
                        ? 'border-green-500'
                        : 'border-slate-600'
                    }`}
                    onClick={() => handleSeleccionarPlan(plan)}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-white">{plan.nombre}</h4>
                      {plan.plan_id === membresiaActual?.plan.plan_id && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                          Actual
                        </span>
                      )}
                    </div>
                    {plan.descripcion && (
                      <p className="text-sm text-gray-400 mt-1">{plan.descripcion}</p>
                    )}
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-2xl font-bold text-blue-400">
                        ${plan.precio.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-400">
                        {plan.duracion_dias} días
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Flujo 4: Confirmar */}
          {step === 'confirmar' && planSeleccionado && (
            <div>
              <button
                onClick={() => {
                  if (membresiaActual) {
                    setStep('con-membresia');
                  } else {
                    setStep('sin-membresia');
                  }
                }}
                className="text-blue-400 hover:text-blue-300 text-sm mb-4 flex items-center gap-2"
              >
                ← Volver
              </button>

              <div className="bg-slate-700/40 border border-slate-600 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Resumen de Membresía</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-600">
                    <span className="text-gray-400">Plan seleccionado</span>
                    <span className="text-white font-medium">{planSeleccionado.nombre}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b border-slate-600">
                    <span className="text-gray-400">Duración</span>
                    <span className="text-white font-medium">{planSeleccionado.duracion_dias} días</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b border-slate-600">
                    <span className="text-gray-400">Fecha de inicio</span>
                    <span className="text-white font-medium">{calcularFechaInicio()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b border-slate-600">
                    <span className="text-gray-400">Fecha de fin</span>
                    <span className="text-white font-medium">{calcularFechaFin()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-400 text-lg">Total a pagar</span>
                    <span className="text-2xl font-bold text-blue-400">
                      ${planSeleccionado.precio.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {membresiaActual && new Date(membresiaActual.fecha_fin) >= new Date() && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                  <p className="text-yellow-400 text-sm">
                    <strong>Renovación programada:</strong> La nueva membresía iniciará automáticamente 
                    cuando finalice la actual.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    if (membresiaActual) {
                      setStep('con-membresia');
                    } else {
                      setStep('sin-membresia');
                    }
                  }}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handleConfirmar}
                  disabled={loading}
                  icon={loading ? <LoadingSpinner size="sm" /> : <CheckCircle className="w-5 h-5" />}
                >
                  {loading ? 'Procesando...' : 'Confirmar y Asignar'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};