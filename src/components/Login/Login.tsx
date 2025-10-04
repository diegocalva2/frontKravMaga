import { FaUserAstronaut } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { useAlert } from "../Message-global/useAlert";
import z from "zod";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email({ message: "Correo inválido" }),
  password: z.string().min(1, { message: "La contraseña es obligatoria" }),
});

const Login = () => {
  const { showAlert } = useAlert();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.type === "email" ? "email" : "password"]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const formErrors: { email?: string; password?: string } = {};
      result.error.issues.forEach((err) => {
        formErrors[err.path[0] as "email" | "password"] = err.message;
      });
      setErrors(formErrors);
      showAlert("Verifica tus datos", "error");
      return;
    }

    setErrors({});

    const ok = await login(formData.email, formData.password);

    if (ok) {
      navigate("/productos");
    } else {
      showAlert("Credenciales incorrectas", "error");
    }
  };

  const isDisabled = !formData.email || !formData.password;

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"    >
      <div className="w-full max-w-md bg-white/20 backdrop-blur-md border border-white/30 shadow-xl rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h1 className="text-3xl font-semibold text-center text-gray-800">
            Login
          </h1>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/40 border border-gray-300 focus:border-blue-500 focus:bg-white/60 outline-none transition"
            />
            <FaUserAstronaut className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600" />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              placeholder="Contraseña"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/40 border border-gray-300 focus:border-blue-500 focus:bg-white/60 outline-none transition"
            />
            <RiLockPasswordFill className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600" />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Recordar / Forgot */}
          <div className="flex justify-between text-sm text-gray-700">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-blue-600" /> Recuérdame
            </label>
            <a href="#" className="hover:underline text-blue-700">
              Olvidé mi contraseña
            </a>
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={isDisabled}
            className={`w-full py-3 rounded-xl font-semibold text-white transition ${isDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-700 to-blue-900 hover:scale-[1.02] shadow-lg"
              }`}
          >
            Iniciar Sesión
          </button>

          {/* Registro */}
          <p className="text-center text-sm text-gray-700">
            ¿No tienes una cuenta?{" "}
            <a href="#" className="font-semibold text-green-600 hover:underline">
              Regístrate
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;