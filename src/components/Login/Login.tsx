import './Login.css'
import { FaUserAstronaut } from "react-icons/fa";
import { RiLockPasswordFill } from 'react-icons/ri';

const Login = () => {
    return (
        <div className="login-container">
            <form action="">
                <h1>Login</h1>
                <div className="input-box">
                    <input type="email" placeholder='Email' required />
                    <FaUserAstronaut className='icon' />
                </div>

                <div className="input-box">
                    <input type="password" placeholder='Contraseña' required />
                    <RiLockPasswordFill className='icon' />
                </div>

                <div className="remember-forgot">
                    <label>
                        <input type="checkbox" /> Recuérdame
                    </label>
                    <a href="#">Olvidé mi contraseña</a>
                </div>

                <button type="submit">Iniciar Sesión</button>
                <div className="register-link">
                    <p>¿No tienes una cuenta? <a href="#">Regístrate</a></p>
                </div>
            </form>
        </div>
    )
}

export default Login