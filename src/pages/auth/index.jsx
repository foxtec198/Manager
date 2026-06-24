// Utils and Widgets
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from "primereact/floatlabel"
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoading } from "../../providers/LoadingProvider";
import { useToast } from '../../providers/ToastProvider';

// CSS's
import './style.css';

// Services
import AuthService from '../../services/auth';

// Logic and vars
export default function Auth() {
  const [mat, setMat] = useState("");
  const [pwd, setPwd] = useState("");
  const { setLoading } = useLoading();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const auth = AuthService;

  const setAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await auth.login(mat, pwd);
      sessionStorage.setItem("display_name", res.data.display_name)
      navigate("/init");
    }
    catch (err) { showToast("info", "Login incorreto!", err.response.data) }
    finally { setLoading(false) }
  };

  return (
    <>
      <main>
        <img src="https://api.hubbix.com.br/img/logo.png" width={120} alt="brand_hubbix" />
        <form onSubmit={setAuth}>
          <FloatLabel className="w-full">
            <InputText
              className="w-full"
              keyfilter="int"
              value={mat}
              onChange={(e) => setMat(e.target.value)}
              autoComplete='username'
              required
            />
            <label htmlFor="password">Matricula</label>
          </FloatLabel>

          <FloatLabel className="w-full">
            <Password
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              feedback={false}
              required
              toggleMask
              className="w-full"
              inputClassName="w-full"
            />
            <label htmlFor="password">Senha</label>
          </FloatLabel>
          <Button type='submit' className='w-full' label="Realizar Login" icon="pi pi-sign-in" />
          <span>Ainda não tem conta? <a target='_blank' href="https://hubbix.com.br/pages/teste_gratis.html">Crie Uma!</a></span>
        </form>
      </main>
    </>
  );
};