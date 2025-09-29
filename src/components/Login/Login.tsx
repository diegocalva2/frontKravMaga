import './Login.css'
import { FaUserAstronaut } from "react-icons/fa";
import { RiLockPasswordFill } from 'react-icons/ri';
import { useAlert } from '../Message-global/AlertProvider';
import z from 'zod';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email({ message: "Correo inválido" }),
  password: z.string().min(1, { message: "La contraseña es obligatoria" })
});

const Login = () => {
  const { showAlert } = useAlert();
  const { login } = useAuth();
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.type === "email" ? "email" : "password"]: e.target.value
    });
  };

  // Componente Login.tsx (FUNCIÓN handleSubmit MODIFICADA)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const formErrors: { email?: string; password?: string } = {};
      result.error.issues.forEach(err => {
        formErrors[err.path[0] as "email" | "password"] = err.message;
      });
      setErrors(formErrors);
      showAlert("Verifica tus datos", "error");
      return;
    }

    setErrors({});

    const ok = await login(formData.email, formData.password);

    if (ok) {
      showAlert("Inicio de sesión exitoso", "success");
      navigate("/page");
    } else {
      showAlert("Credenciales incorrectas", "error");
    }
  };

  const isDisabled = !formData.email || !formData.password;

  return (
    

    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>

        <div className="input-box">
          <input
            type="email"
            placeholder="Email"
            onChange={handleChange}
          />
          <FaUserAstronaut className="icon" />
        </div>
        {errors.email && <p className="error">{errors.email}</p>}

        <div className="input-box">
          <input
            type="password"
            placeholder="Contraseña"
            onChange={handleChange}
          />
          <RiLockPasswordFill className="icon" />
        </div>
        {errors.password && <p className="error">{errors.password}</p>}

        <div className="remember-forgot">
          <label>
            <input type="checkbox" /> Recuérdame
          </label>
          <a href="#">Olvidé mi contraseña</a>
        </div>

        <button type="submit" disabled={isDisabled}>
          Iniciar Sesión
        </button>

        <div className="register-link">
          <p>¿No tienes una cuenta? <a href="#">Regístrate</a></p>
        </div>
      </form>
    </div>
  );
};

export default Login;