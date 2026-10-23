import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const EduFanorRegisterForm = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const isAr = i18n.language === 'ar';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg(isAr ? 'كلمات المرور غير متطابقة!' : 'Passwords do not match!');
      return;
    }

    setLoading(true);

    const fullName = `${firstName} ${lastName}`.trim();

    // التعامل مع التسجيل سواء كان عبر دالة الـ Context أو محلياً
    if (auth && auth.register) {
      const result = await auth.register(fullName, email, password);
      setLoading(false);
      if (result && result.success) {
        navigate('/dashboard');
      } else {
        setErrorMsg(result?.message || (isAr ? 'فشل إنشاء الحساب' : 'Registration failed'));
      }
    } else {
      setTimeout(() => {
        const userData = {
          name: fullName || (isAr ? 'مستخدم جديد' : 'New User'),
          email: email || 'user@edufanor.com',
        };
        localStorage.clear();
        localStorage.setItem('user_name', userData.name);
        localStorage.setItem('user_email', userData.email);
        localStorage.setItem('token', 'fake-jwt-token');

        setLoading(false);
        navigate('/dashboard');
      }, 600);
    }
  };

  return (
    <StyledWrapper>
      <form className="form" onSubmit={handleRegisterSubmit}>
        
        {/* زر الرجوع للرئيسية */}
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
            {t('auth.registerTitle', { defaultValue: isAr ? 'إنشاء حساب جديد' : 'Create an Account' })}
          </h2>
          <p className="form-subtitle">
            {t('auth.registerSubtitle', { defaultValue: isAr ? 'سجل الآن وابدأ رحلتك في تعلم الإسعافات الأولية' : 'Sign up now and start learning first-aid' })}
          </p>
        </div>

        {errorMsg && <div className="error-banner">{errorMsg}</div>}

        {/* First & Last Name */}
        <div className="flex-row-inputs">
          <div className="input-group">
            <label>{t('auth.firstName', { defaultValue: isAr ? 'الاسم الأول' : 'First Name' })}</label>
            <div className="inputForm">
              <input 
                type="text" 
                required 
                className="input" 
                placeholder={isAr ? 'الاسم الأول' : 'First name'} 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
          </div>
          <div className="input-group">
            <label>{t('auth.lastName', { defaultValue: isAr ? 'اسم العائلة' : 'Last Name' })}</label>
            <div className="inputForm">
              <input 
                type="text" 
                required 
                className="input" 
                placeholder={isAr ? 'اسم العائلة' : 'Last name'} 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Email Field */}
        <div className="flex-column">
          <label>{t('auth.email', { defaultValue: isAr ? 'البريد الإلكتروني' : 'Email' })}</label>
        </div>
        <div className="inputForm">
          <input 
            type="email" 
            required 
            className="input" 
            placeholder={isAr ? 'أدخل بريدك الإلكتروني' : 'Enter your Email'} 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password Field */}
        <div className="flex-column">
          <label>{t('auth.password', { defaultValue: isAr ? 'كلمة المرور' : 'Password' })}</label>
        </div>
        <div className="inputForm">
          <input 
            type="password" 
            required 
            className="input" 
            placeholder={isAr ? 'أدخل كلمة المرور' : 'Enter your Password'} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Confirm Password Field */}
        <div className="flex-column">
          <label>{t('auth.confirmPassword', { defaultValue: isAr ? 'تأكيد كلمة المرور' : 'Confirm Password' })}</label>
        </div>
        <div className="inputForm">
          <input 
            type="password" 
            required 
            className="input" 
            placeholder={isAr ? 'أعد إدخال كلمة المرور' : 'Confirm your Password'} 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="button-submit" disabled={loading}>
          {loading 
            ? t('auth.signingUp', { defaultValue: isAr ? 'جاري إنشاء الحساب...' : 'Creating Account...' }) 
            : t('auth.signUpBtn', { defaultValue: isAr ? 'إنشاء حساب' : 'Sign Up' })
          }
        </button>

        {/* Login Redirect */}
        <p className="p">
          {t('auth.hasAccount', { defaultValue: isAr ? 'لديك حساب بالفعل؟' : 'Already have an account?' })} 
          <Link to="/login" className="span">
            {t('auth.signIn', { defaultValue: isAr ? 'تسجيل الدخول' : 'Sign In' })}
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

  .error-banner {
    background-color: #fee2e2;
    color: #b91c1c;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 12px;
    text-align: center;
    font-weight: 600;
  }

  .form-top {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 2px;
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
    margin-bottom: 5px;
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

  .flex-column > label, .input-group > label {
    color: #49305D;
    font-weight: 700;
    font-size: 13px;
    .dark & {
      color: #E9E0F5;
    }
  }

  .flex-row-inputs {
    display: flex;
    gap: 10px;
  }

  .input-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .inputForm {
    border: 1.5px solid #EDE6F5;
    border-radius: 12px;
    height: 46px;
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
    margin: 10px 0 5px 0;
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
    margin: 6px 0;
    .dark & {
      color: #C9BED5;
    }
  }
`;

export default EduFanorRegisterForm;