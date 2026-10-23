import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const EduFanorLoginForm = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const isAr = i18n.language === 'ar';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // إرسال البريد وكلمة السر بشكل صحيح للدالة
      if (auth && auth.login) {
        const res = await auth.login(email, password);

        setLoading(false);

        // التوجيه الذكي حسب نوع الحساب (Admin / Student)
        const cleanEmail = email ? email.trim().toLowerCase() : '';
        const isAdmin = cleanEmail === 'noura@edufanor.com' || cleanEmail.includes('admin') || res?.user?.role === 'admin';

        if (isAdmin) {
          navigate('/admin', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      setLoading(false);
    }
  };

  return (
    <StyledWrapper>
      <form className="form" onSubmit={handleLoginSubmit}>
        
        {/* زر الرجوع إلى الصفحة الرئيسية */}
        <div className="form-top shadow-sm">
          <Link to="/" className="back-link" title={isAr ? 'الرجوع للرئيسية' : 'Back to Home'}>
            {isAr ? <ArrowRight className="w-4 h-4 text-[#8A6BBE]" /> : <ArrowLeft className="w-4 h-4 text-[#8A6BBE]" />}
            <span>{isAr ? 'الرئيسية' : 'Home'}</span>
          </Link>
        </div>

        {/* Header */}
        <div className="form-header">
          <Link to="/">
            <img src="/edufanor.png" alt="EduFanor Logo" className="form-logo" />
          </Link>
          <h2 className="form-title">
            {t('auth.welcomeBack', { defaultValue: isAr ? 'مرحباً بعودتك إلى EduFanor' : 'Welcome Back to EduFanor' })}
          </h2>
          <p className="form-subtitle">
            {t('auth.subtitle', { defaultValue: isAr ? 'سجل الدخول لمتابعة رحلة تعلم الإسعافات الأولية' : 'Sign in to continue your first-aid learning' })}
          </p>
        </div>

        {/* Email Field */}
        <div className="flex-column">
          <label>{t('auth.email', { defaultValue: isAr ? 'البريد الإلكتروني' : 'Email' })}</label>
        </div>
        <div className="inputForm">
          <svg height={20} viewBox="0 0 32 32" width={20} xmlns="http://www.w3.org/2000/svg">
            <g id="Layer_3" data-name="Layer 3">
              <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" />
            </g>
          </svg>
          <input 
            type="email" 
            required 
            className="input" 
            placeholder={t('auth.emailPlaceholder', { defaultValue: isAr ? 'أدخل بريدك الإلكتروني' : 'Enter your Email' })} 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password Field */}
        <div className="flex-column">
          <label>{t('auth.password', { defaultValue: isAr ? 'كلمة المرور' : 'Password' })}</label>
        </div>
        <div className="inputForm">
          <svg height={20} viewBox="-64 0 512 512" width={20} xmlns="http://www.w3.org/2000/svg">
            <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
            <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
          </svg>
          <input 
            type="password" 
            required 
            className="input" 
            placeholder={t('auth.passwordPlaceholder', { defaultValue: isAr ? 'أدخل كلمة المرور' : 'Enter your Password' })} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Remember me & Forgot Password */}
        <div className="flex-row">
          <div>
            <input type="checkbox" id="remember" />
            <label htmlFor="remember" style={{ cursor: 'pointer' }}> 
              {t('auth.rememberMe', { defaultValue: isAr ? 'تذكرني' : 'Remember me' })}
            </label>
          </div>
          <span className="span">
            {t('auth.forgotPassword', { defaultValue: isAr ? 'نسيت كلمة المرور؟' : 'Forgot password?' })}
          </span>
        </div>

        {/* Submit Button */}
        <button type="submit" className="button-submit" disabled={loading}>
          {loading 
            ? t('auth.signingIn', { defaultValue: isAr ? 'جاري تسجيل الدخول...' : 'Signing In...' }) 
            : t('auth.signInBtn', { defaultValue: isAr ? 'تسجيل الدخول' : 'Sign In' })
          }
        </button>

        {/* Register Redirect */}
        <p className="p">
          {t('auth.noAccount', { defaultValue: isAr ? 'ليس لديك حساب؟' : "Don't have an account?" })} 
          <Link to="/register" className="span">
            {t('auth.signUp', { defaultValue: isAr ? 'حساب جديد' : 'Sign Up' })}
          </Link>
        </p>

      </form>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #FCFAFF;
  padding: 20px;

  .dark & {
    background-color: #17121D;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    background-color: #ffffff;
    padding: 30px;
    width: 440px;
    border-radius: 24px;
    box-shadow: 0 10px 25px rgba(73, 48, 93, 0.08);
    border: 1px solid #EDE6F5;
    font-family: inherit;
    position: relative;

    .dark & {
      background-color: #21192B;
      border-color: #3B2B4C;
      color: #F8F4FC;
    }
  }

  .form-top {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 5px;
  }

  .back-link {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 700;
    color: #8A6BBE;
    text-decoration: none;
    padding: 6px 12px;
    border-radius: 20px;
    background-color: #F4EFFB;
    transition: all 0.2s ease-in-out;

    .dark & {
      background-color: #17121D;
    }

    &:hover {
      background-color: #E9E0F5;
      transform: translateX(-2px);
    }
  }

  .form-header {
    text-align: center;
    margin-bottom: 10px;
  }

  .form-logo {
    height: 40px;
    object-fit: contain;
    margin-bottom: 8px;
    transition: transform 0.2s;
    cursor: pointer;

    &:hover {
      transform: scale(1.05);
    }
  }

  .form-title {
    font-size: 20px;
    font-weight: 900;
    color: #49305D;
    .dark & {
      color: #FFFFFF;
    }
  }

  .form-subtitle {
    font-size: 12px;
    color: #6B5E7C;
    .dark & {
      color: #C9BED5;
    }
  }

  .flex-column > label {
    color: #49305D;
    font-weight: 700;
    font-size: 13px;
    .dark & {
      color: #E9E0F5;
    }
  }

  .inputForm {
    border: 1.5px solid #EDE6F5;
    border-radius: 12px;
    height: 48px;
    display: flex;
    align-items: center;
    padding-left: 12px;
    padding-right: 12px;
    transition: 0.2s ease-in-out;
    background-color: #FCFAFF;

    .dark & {
      background-color: #17121D;
      border-color: #3B2B4C;
    }
  }

  .input {
    margin-left: 10px;
    border-radius: 10px;
    border: none;
    width: 100%;
    height: 100%;
    background: transparent;
    color: #1F142E;
    font-size: 13px;

    .dark & {
      color: #FFFFFF;
    }
  }

  .input:focus {
    outline: none;
  }

  .inputForm:focus-within {
    border: 1.5px solid #8A6BBE;
    box-shadow: 0 0 0 3px rgba(138, 107, 190, 0.15);
  }

  .flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
    font-size: 13px;
  }

  .flex-row > div > label {
    font-size: 13px;
    color: #6B5E7C;
    font-weight: 500;
    .dark & {
      color: #C9BED5;
    }
  }

  .span {
    font-size: 13px;
    margin-left: 5px;
    color: #8A6BBE;
    font-weight: 700;
    cursor: pointer;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .button-submit {
    margin: 15px 0 5px 0;
    background-color: #49305D;
    border: none;
    color: white;
    font-size: 14px;
    font-weight: 700;
    border-radius: 12px;
    height: 48px;
    width: 100%;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #39244A;
    }
  }

  .p {
    text-align: center;
    color: #6B5E7C;
    font-size: 13px;
    margin: 8px 0;
    .dark & {
      color: #C9BED5;
    }
  }
`;

export default EduFanorLoginForm;