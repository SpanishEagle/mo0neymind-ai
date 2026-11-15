import { cloneElement, isValidElement, useEffect, useState } from 'react';
import { Mail, LockKeyhole, LogOut, ShieldCheck, Sparkles, X, UserRound, Eye, EyeOff } from 'lucide-react';
import { supabase, supabaseConfigured } from './supabaseClient';
import {
  captureFinanceData, restoreFinanceData, loadCloudData,
  queueCloudSave, flushCloudSave, setCloudUser, subscribeCloudStatus
} from './cloudSync';
import './AuthGate.css';

export default function AuthGate({ children }) {
  const [session, setSession] = useState(null);
  const [checked, setChecked] = useState(false);
  const [loadedUser, setLoadedUser] = useState(null);
  const [importChoice, setImportChoice] = useState(null);
  // Los datos previos quedan disponibles para importar solo si el usuario lo decide.
  const [legacyData] = useState(() => captureFinanceData());
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [syncStatus, setSyncStatus] = useState('');
  const [accountOpen, setAccountOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [accountNotice, setAccountNotice] = useState('');

  useEffect(() => subscribeCloudStatus((status, detail) => {
    setSyncStatus(status === 'saved' ? 'Guardado en la nube' :
      status === 'saving' ? 'Guardando…' : `Error de sincronización: ${detail}`);
  }), []);

  useEffect(() => {
    if (!supabase) { setChecked(true); return; }
    let live = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!live) return;
      if (error) setMessage(error.message);
      setSession(data?.session ?? null);
      setChecked(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => {
      // La carga de la base de datos va en otro efecto (no dentro del callback).
      setSession(next);
      setChecked(true);
    });
    return () => { live = false; subscription.unsubscribe(); };
  }, []);

  const userId = session?.user?.id ?? null;

  useEffect(() => {
    if (!checked) return;
    let cancelled = false;
    setLoadedUser(null);
    setImportChoice(null);
    setCloudUser(null);
    if (!userId) return;
    (async () => {
      try {
        const remote = await loadCloudData(userId);
        if (cancelled) return;
        if (remote !== null) {
          restoreFinanceData(remote);
          setCloudUser(userId);
          setLoadedUser(userId);
        } else {
          // Nunca importar automáticamente datos del navegador a otra cuenta.
          const available = Object.keys(legacyData).length > 0;
          if (available) setImportChoice(userId);
          else {
            restoreFinanceData({});
            setCloudUser(userId);
            setLoadedUser(userId);
          }
        }
      } catch (error) {
        if (!cancelled) setMessage(`No se han podido cargar los datos: ${error.message}`);
      }
    })();
    return () => { cancelled = true; };
  }, [userId, checked, legacyData]);

  function chooseImport(shouldImport) {
    restoreFinanceData(shouldImport ? legacyData : {});
    setCloudUser(userId);
    setImportChoice(null);
    setLoadedUser(userId);
  }

  async function submitAuth(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    const options = { email: email.trim(), password };
    try {
      const { data, error } = mode === 'register'
        ? await supabase.auth.signUp({ ...options, options: { emailRedirectTo: window.location.origin } })
        : await supabase.auth.signInWithPassword(options);
      if (error) throw error;
      if (mode === 'register' && !data.session) {
        setMessage('Revisa tu correo electrónico y confirma tu cuenta antes de iniciar sesión.');
      }
    } catch (error) { setMessage(error.message); }
    finally { setBusy(false); }
  }

  async function resetPassword() {
    if (!email.trim()) { setMessage('Escribe primero tu correo electrónico.'); return; }
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin
    });
    setMessage(error ? error.message : 'Si el correo existe, recibirás instrucciones para recuperar el acceso.');
    setBusy(false);
  }

  async function signOut() {
    setBusy(true);
    setMessage('');
    try {
      await flushCloudSave();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setCloudUser(null);
      restoreFinanceData({});
      setLoadedUser(null);
      setSession(null);
    } catch (error) {
      setMessage(`No se pudo cerrar sesión de forma segura: ${error.message}`);
    } finally { setBusy(false); }
  }


  const language = (() => {
    try { return localStorage.getItem('mm_language') === 'en' ? 'en' : 'es'; }
    catch { return 'es'; }
  })();
  const en = language === 'en';

  function closeAccount() {
    if (busy) return;
    setAccountOpen(false);
    setNewPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setAccountNotice('');
  }

  async function changePassword(event) {
    event.preventDefault();
    if (busy) return;
    setAccountNotice('');
    if (newPassword.length < 8) {
      setAccountNotice(en ? 'Use at least 8 characters.' : 'Utiliza al menos 8 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setAccountNotice(en ? 'Passwords do not match.' : 'Las contraseñas no coinciden.');
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setNewPassword('');
      setConfirmPassword('');
      setAccountNotice(en ? 'Password updated successfully.' : 'Contraseña actualizada correctamente.');
    } catch (error) {
      setAccountNotice(error.message || (en ? 'Could not update the password.' : 'No se pudo actualizar la contraseña.'));
    } finally {
      setBusy(false);
    }
  }

  if (!supabaseConfigured) return (
    <div className="mm-auth-page"><div className="mm-auth-box">
      <h2>Configura la conexión de MoneyMind AI</h2>
      <p>Faltan VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY en tu archivo .env.local.</p>
      <p>No introduzcas claves secretas de servicio en el navegador.</p>
    </div></div>
  );
  if (!checked || (userId && loadedUser !== userId && !importChoice)) return (
    <div className="mm-auth-page"><div className="mm-auth-box"><p>Cargando cuenta y datos seguros…</p>{message && <p className="mm-auth-error">{message}</p>}</div></div>
  );
  if (userId && importChoice === userId) return (
    <div className="mm-auth-page"><div className="mm-auth-box">
      <ShieldCheck size={30}/><h2>¿Importar tus datos anteriores?</h2>
      <p>Esta cuenta no tiene datos en la nube. Hemos encontrado información guardada en este navegador. Importarla es opcional; no se mezclará automáticamente con otra cuenta.</p>
      <button className="mm-auth-primary" onClick={() => chooseImport(true)}>Sí, importar mis datos locales</button>
      <button className="mm-auth-secondary" onClick={() => chooseImport(false)}>No, empezar con mi cuenta nueva</button>
    </div></div>
  );
  if (userId && loadedUser === userId) return (
    <>
      {message && <div className="mm-cloud-error" role="alert">{message}</div>}
      {isValidElement(children)
        ? cloneElement(children, {
            accountEmail: session.user.email || '',
            onOpenAccount: () => { setAccountNotice(''); setAccountOpen(true); }
          })
        : children}
      {accountOpen && (
        <div className="mm-account-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeAccount(); }}>
          <section className="mm-account-dialog" role="dialog" aria-modal="true" aria-labelledby="mm-account-heading">
            <header className="mm-account-dialog-head">
              <div className="mm-account-heading-group">
                <span className="mm-account-dialog-icon"><UserRound size={22}/></span>
                <div>
                  <h2 id="mm-account-heading">{en ? 'My account' : 'Mi cuenta'}</h2>
                  <p title={session.user.email}>{session.user.email}</p>
                </div>
              </div>
              <button type="button" className="mm-account-close" aria-label={en ? 'Close' : 'Cerrar'} onClick={closeAccount} disabled={busy}><X size={19}/></button>
            </header>
            <div className="mm-account-dialog-body">
              <p className="mm-account-sync" role="status">{syncStatus || (en ? 'Cloud synchronization enabled' : 'Sincronización en la nube activada')}</p>
              <h3><LockKeyhole size={18}/> {en ? 'Change password' : 'Cambiar contraseña'}</h3>
              <form className="mm-account-password-form" onSubmit={changePassword}>
                <label>{en ? 'New password' : 'Nueva contraseña'}
                  <span className="mm-account-password-control">
                    <input type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength={8} value={newPassword} onChange={event => setNewPassword(event.target.value)} required />
                    <button type="button" aria-label={showPassword ? (en ? 'Hide password' : 'Ocultar contraseña') : (en ? 'Show password' : 'Mostrar contraseña')} onClick={() => setShowPassword(prev => !prev)}>{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button>
                  </span>
                </label>
                <label>{en ? 'Confirm new password' : 'Confirmar nueva contraseña'}
                  <input type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength={8} value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} required />
                </label>
                <button className="mm-auth-primary" type="submit" disabled={busy}>{busy ? (en ? 'Saving…' : 'Guardando…') : (en ? 'Update password' : 'Actualizar contraseña')}</button>
              </form>
              {accountNotice && <p className="mm-account-notice" role="status">{accountNotice}</p>}
              <div className="mm-account-divider"/>
              <button type="button" className="mm-account-signout" onClick={signOut} disabled={busy}><LogOut size={17}/>{en ? 'Sign out' : 'Cerrar sesión'}</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
  return (
    <div className="mm-auth-page">
      <div className="mm-auth-box">
        <div className="mm-auth-logo"><Sparkles size={25}/></div>
        <h1>MoneyMind AI</h1>
        <p>Tu dinero, organizado y sincronizado en tus dispositivos.</p>
        <h2>{mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</h2>
        <form onSubmit={submitAuth}>
          <label><Mail size={17}/> Correo electrónico<input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
          <label><LockKeyhole size={17}/> Contraseña<input type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} minLength={8} value={password} onChange={e => setPassword(e.target.value)} required /></label>
          <button className="mm-auth-primary" type="submit" disabled={busy}>{busy ? 'Procesando…' : mode === 'login' ? 'Entrar' : 'Registrarme'}</button>
        </form>
        <button type="button" className="mm-auth-link" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setMessage(''); }}>{mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}</button>
        <button type="button" className="mm-auth-link" onClick={resetPassword} disabled={busy}>He olvidado mi contraseña</button>
        {message && <p className="mm-auth-info" role="status">{message}</p>}
        <p className="mm-auth-note">No conectamos cuentas bancarias. Tus datos de presupuesto se guardan en una base de datos protegida por usuario.</p>
      </div>
    </div>
  );
}
