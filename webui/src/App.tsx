import React, { useState } from 'react';
import { Mail, Phone, FileText, Send, Globe } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { translations } from './translations';
import Confetti from 'react-confetti';

interface BetaTesterInfo {
  email: string;
  phone?: string;
  remarks?: string;
}

function App() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [remarks, setRemarks] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(''); // 用于存储错误信息
  const [showConfetti, setShowConfetti] = useState(false);
  const [emailError, setEmailError] = useState(''); // 用于存储邮箱验证的错误消息
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  // 自定义邮箱验证函数
  const validateEmail = (value: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (value.length < 5 || value.length > 50) {
      return '邮箱长度应在 5 到 50 个字符之间';
    }
    if (!emailPattern.test(value)) {
      return '邮箱格式不正确';
    }
    return '';
  };

  // 处理邮箱输入框的变化
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // 实时验证邮箱格式和长度
    const error = validateEmail(value);
    setEmailError(error);
  };

  // 表单提交处理函数
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 最后检查邮箱是否存在错误
    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }

    // 构建要发送到后端的数据对象
    const betaTesterInfo: BetaTesterInfo = { email };
    if (phone) betaTesterInfo.phone = phone;
    if (remarks) betaTesterInfo.remarks = remarks;

    try {
      // 使用 fetch 发送 POST 请求到 FastAPI 后端
      const response = await fetch('http://127.0.0.1:18009/beta_testers/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(betaTesterInfo), // 将数据对象转换为 JSON 字符串
      });

      // 检查请求是否成功
      if (response.ok) {
        console.log('数据已成功存储');

        // 设置提交状态、清空表单，并清空错误信息
        setSubmitted(true);
        setError('');
        setEmail('');
        setPhone('');
        setRemarks('');

        // 显示气球动画，并在 5 秒后自动隐藏
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      } else {
        const errorMessage = `email already exists: ${response.statusText}`;
        setError(errorMessage);  // 设置错误信息状态
        console.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = `提交表单时出错: ${error}`;
      setError(errorMessage);  // 设置错误信息状态
      console.error(errorMessage);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 relative">
      {/* Confetti 气球动画 */}
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 relative">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <button
            onClick={toggleLanguage}
            className="flex items-center justify-center p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
          >
            <Globe className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">中/EN</span>
          </button>
        </div>
        {submitted ? (
          <div className="text-green-600 text-center mb-4">
            {t.success}
          </div>
        ) : error ? (
          <div className="text-red-600 text-center mb-4">
            {error} {/* 显示错误信息 */}
          </div>
        ) : null}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t.email} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange} // 使用自定义的邮箱处理函数
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 pl-10"
                placeholder={t.emailPlaceholder}
              />
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            {/* 显示邮箱验证的错误信息 */}
            {emailError && <div className="text-red-500 text-sm mt-1">{emailError}</div>}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              {t.phone}
            </label>
            <div className="relative">
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 pl-10"
                placeholder={t.phonePlaceholder}
              />
              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div>
            <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
              {t.remarks}
            </label>
            <div className="relative">
              <textarea
                id="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 pl-10"
                rows={3}
                placeholder={t.remarksPlaceholder}
              ></textarea>
              <FileText className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
          >
            <Send className="h-5 w-5 mr-2" />
            {t.submit}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;