import React, { useEffect, useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import type { AlumnoFormData } from '../types/alumnosTypes';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/input';
import alumnosService from '../services/alumnosServices';

interface AlumnoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AlumnoFormData) => Promise<void>;
  alumno?: AlumnoFormData | null;
  alumnoIdActual?: string; // Para excluir al alumno actual en edición
}

export const AlumnoFormModal: React.FC<AlumnoFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  alumno,
  alumnoIdActual
}) => {
  const [formData, setFormData] = useState<AlumnoFormData>({
    nombre_completo: '',
    fecha_nacimiento: '',
    fecha_ingreso: new Date().toISOString().split('T')[0],
    celular: '',
    correo: '',
    estado_alumno_id: 1,
    notas_instructor: '',
    contacto_emergencia: '',
    parentezco_contacto_emergencia: '',
    condiciones_medicas: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AlumnoFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmergencia, setShowEmergencia] = useState(false);
  const [showMedica, setShowMedica] = useState(false);

  useEffect(() => {
    if (alumno) {
      setFormData(alumno);
      // Expandir secciones si tienen datos
      setShowEmergencia(!!(alumno.contacto_emergencia || alumno.parentezco_contacto_emergencia));
      setShowMedica(!!(alumno.condiciones_medicas || alumno.notas_instructor));
    } else {
      setFormData({
        nombre_completo: '',
        fecha_nacimiento: '',
        fecha_ingreso: new Date().toISOString().split('T')[0],
        celular: '',
        correo: '',
        estado_alumno_id: 1,
        notas_instructor: '',
        contacto_emergencia: '',
        parentezco_contacto_emergencia: '',
        condiciones_medicas: ''
      });
      setShowEmergencia(false);
      setShowMedica(false);
    }
    setErrors({});
  }, [alumno, isOpen]);

  const normalizarNombre = (nombre: string): string => {
    return nombre
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ') // Múltiples espacios a uno solo
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Quitar acentos para comparación
  };

  const verificarNombreDuplicado = async (nombre: string): Promise<boolean> => {
    try {
      const nombreNormalizado = normalizarNombre(nombre);
      const alumnos = await alumnosService.obtenerTodos();
      
      return alumnos.some(a => {
        // Excluir el alumno actual si estamos editando
        if (alumnoIdActual && a.alumno_id === alumnoIdActual) {
          return false;
        }
        
        const nombreExistenteNormalizado = normalizarNombre(a.nombre_completo);
        return nombreExistenteNormalizado === nombreNormalizado;
      });
    } catch (error) {
      console.error('Error al verificar duplicados:', error);
      return false;
    }
  };

  const validateForm = async (): Promise<boolean> => {
    const newErrors: Partial<Record<keyof AlumnoFormData, string>> = {};

    // Validar nombre
    if (!formData.nombre_completo.trim()) {
  newErrors.nombre_completo = 'El nombre es obligatorio';
} else if (formData.nombre_completo.trim().length < 3) {
  newErrors.nombre_completo = 'El nombre debe tener al menos 3 caracteres';
} else {
  // 🔹 Nueva validación: solo letras y espacios
  const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  if (!nombreRegex.test(formData.nombre_completo.trim())) {
    newErrors.nombre_completo = 'El nombre solo puede contener letras y espacios';
  } else {
    // 🔹 Si pasa, verificar duplicados
    const esDuplicado = await verificarNombreDuplicado(formData.nombre_completo);
    if (esDuplicado) {
      newErrors.nombre_completo = 'Ya existe un alumno con ese nombre, por favor proporciona uno distinto';
    }
  }
}


    if (!formData.fecha_nacimiento) {
      newErrors.fecha_nacimiento = 'La fecha de nacimiento es obligatoria';
    }

    if (!formData.fecha_ingreso) {
      newErrors.fecha_ingreso = 'La fecha de ingreso es obligatoria';
    }

    if (formData.celular && formData.celular.length !== 10) {
      newErrors.celular = 'El celular debe tener 10 dígitos';
    }

    if (formData.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = 'El formato del correo no es válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = await validateForm();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      // Normalizar el nombre antes de enviar
      const dataToSubmit = {
        ...formData,
        nombre_completo: formData.nombre_completo.trim().replace(/\s+/g, ' ')
      };
      
      await onSubmit(dataToSubmit);
      onClose();
    } catch (error) {
      console.error('Error al guardar alumno:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

  if (name === "nombre_completo") {
    // 🔹 Permitir solo letras, espacios y acentos (bloquea números y símbolos)
    const soloLetras = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
    setFormData(prev => ({ ...prev, [name]: soloLetras }));
  } else {
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  // 🔹 Limpiar error del campo si el usuario lo corrige
  if (errors[name as keyof AlumnoFormData]) {
    setErrors(prev => ({ ...prev, [name]: undefined }));
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-slate-800 rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm px-4 py-3 border-b border-slate-700 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-white">
            {alumno ? 'Editar Alumno' : 'Agregar Nuevo Alumno'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Datos Personales */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 pb-1.5 border-b border-slate-700">
              Datos Personales
            </h3>
            <div className="space-y-3">
              <Input
                label="Nombre Completo *"
                name="nombre_completo"
                value={formData.nombre_completo}
                onChange={handleChange}
                error={errors.nombre_completo}
                className="text-sm"
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Fecha de Nacimiento *"
                  name="fecha_nacimiento"
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                  error={errors.fecha_nacimiento}
                  className="text-sm"
                />

                <Input
                  label="Fecha de Ingreso *"
                  name="fecha_ingreso"
                  type="date"
                  value={formData.fecha_ingreso}
                  onChange={handleChange}
                  error={errors.fecha_ingreso}
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 pb-1.5 border-b border-slate-700">
              Información de Contacto
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Celular"
                name="celular"
                type="tel"
                value={formData.celular || ''}
                onChange={handleChange}
                error={errors.celular}
                maxLength={10}
                className="text-sm"
              />

              <Input
                label="Correo Electrónico"
                name="correo"
                type="email"
                value={formData.correo || ''}
                onChange={handleChange}
                error={errors.correo}
                className="text-sm"
              />
            </div>
          </div>

          {/* Contacto de Emergencia - Colapsable */}
          <div className="border border-slate-700 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setShowEmergencia(!showEmergencia)}
              className="w-full px-4 py-2.5 bg-slate-700/40 hover:bg-slate-700/60 transition-colors flex justify-between items-center text-left"
            >
              <span className="text-sm font-medium text-white">Contacto de Emergencia (Opcional)</span>
              {showEmergencia ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>
            
            {showEmergencia && (
              <div className="p-4 space-y-3 bg-slate-800/50">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Nombre del Contacto"
                    name="contacto_emergencia"
                    value={formData.contacto_emergencia || ''}
                    onChange={handleChange}
                    className="text-sm"
                  />

                  <Input
                    label="Parentesco"
                    name="parentezco_contacto_emergencia"
                    value={formData.parentezco_contacto_emergencia || ''}
                    onChange={handleChange}
                    className="text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Información Médica - Colapsable */}
          <div className="border border-slate-700 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setShowMedica(!showMedica)}
              className="w-full px-4 py-2.5 bg-slate-700/40 hover:bg-slate-700/60 transition-colors flex justify-between items-center text-left"
            >
              <span className="text-sm font-medium text-white">Información Médica y Notas (Opcional)</span>
              {showMedica ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>
            
            {showMedica && (
              <div className="p-4 space-y-3 bg-slate-800/50">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Condiciones Médicas
                  </label>
                  <textarea
                    name="condiciones_medicas"
                    value={formData.condiciones_medicas || ''}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Alergias, lesiones previas, medicamentos..."
                    className="w-full bg-slate-700/60 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Notas del Instructor
                  </label>
                  <textarea
                    name="notas_instructor"
                    value={formData.notas_instructor || ''}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Observaciones sobre el alumno..."
                    className="w-full bg-slate-700/60 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-700">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : alumno ? 'Actualizar' : 'Registrar Alumno'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};