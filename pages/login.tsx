import { NextPage } from 'next';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { login } from '../utils'; // 上記で実装したファイル

const LoginPage: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // エラーメッセージ
  const [hasError, setHasError] = useState(false); // エラーの有無
  const [isLoding, setIsLoading] = useState(false); // エラーの有無

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault(); // デフォルトの<form />の挙動を無効にする
    setIsLoading(true);
    try {
      await login(email, password); // email・passwordを使ってログイン
    } catch (e) {
      setError(e.message);
      setHasError(true);
      setIsLoading(false);
    }
    router.push('/dashboard'); // ダッシュボードページへ遷移させる
  };

  return (
    <div className='h-100 p-5'>
      <Head>
        <title>Login Page</title>
        <meta name='description' content='ログイン画面です。' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='h-100 d-flex justify-content-center align-items-center'>
        <div className='card'>
          <h1 className='card-header fs-6'> Login </h1>

          <div className='card-body'>
            <form onSubmit={onSubmit}>
              <div className='mb-2'>
                <label htmlFor='email'>Email</label>
                <div className='input-group has-validation'>
                  <input
                    className={'form-control ' + (hasError ? 'is-invalid' : '')}
                    id='email'
                    value={email}
                    onInput={(e) => setEmail(e.currentTarget.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor='password'>Password</label>
                <div className='input-group has-validation'>
                  <input
                    id='password'
                    type='password'
                    className={'form-control ' + (hasError ? 'is-invalid' : '')}
                    value={password}
                    onInput={(e) => setPassword(e.currentTarget.value)}
                  />
                  <div className='invalid-feedback'>{error}</div>
                </div>
              </div>

              <div className='mt-3 text-center'>
                <button className='btn btn-primary' type='submit' disabled={isLoding}>
                  <span className={isLoding ? 'd-none' : ''}>Login</span>
                  <span
                    className={'spinner-border spinner-border-sm ' + (isLoding ? '' : 'd-none')}
                    role='status'
                  >
                    <span className='visually-hidden'>Loading...</span>
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

LoginPage.getInitialProps = async ({ req, res }) => {
  const isServerSide = typeof window === 'undefined';

  // バックエンドのみで動かす
  if (isServerSide && req && res) {
    const root = process.env.APP_URL;
    const options = { headers: { cookie: req.headers.cookie || '' } };

    const result = await fetch(`${root}/api/me`, options);
    const json = (await result.json()) as { user?: { email: string } };

    //ログインしていればダッシュボード画面へリダイレクトさせる
    if (json.user) {
      res.writeHead(302, { Location: '/dashboard' });
      res.end();
    }
  }

  // フロントエンドのみで動かす
  if (!isServerSide) {
    const result = await fetch('/api/me'); // 認証情報を取得する
    const json = (await result.json()) as { user?: { email: string } };

    //ログインしていればダッシュボード画面へリダイレクトさせる
    if (json.user) Router.push('/dashboard');
  }
  return {};
};

export default LoginPage;
