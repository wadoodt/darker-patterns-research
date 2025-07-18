import { useTranslation } from 'react-i18next';
import { Card } from '@radix-ui/themes';
import { CheckCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const SuccessPage = () => {
  const { t } = useTranslation();
  const [seconds, setSeconds] = useState(10);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          window.location.href = '/login';
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleGoLogin = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    window.location.href = '/login';
  };

  return (
    <main>
      <Card style={{ maxWidth: 400, margin: '4rem auto', padding: 32, textAlign: 'center' }}>
        <CheckCircle size={48} color="green" style={{ marginBottom: 16 }} />
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>{t('success.title')}</h1>
        <p style={{ margin: '16px 0' }}>{t('success.description')}</p>
        <button
          onClick={handleGoLogin}
          style={{
            marginTop: 24,
            padding: '12px 32px',
            borderRadius: 6,
            background: '#111',
            color: '#fff',
            fontWeight: 600,
            fontSize: 16,
            border: 'none',
            cursor: 'pointer',
          }}
          aria-label={t('signup.footer.login')}
        >
          {t('signup.footer.login')}
        </button>
        <div style={{ marginTop: 16, color: '#666', fontSize: 14 }}>
          {t('success.autoRedirect', { seconds })}
        </div>
      </Card>
    </main>
  );
};

export default SuccessPage;
