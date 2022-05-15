import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import { useState } from 'react';
import { logout } from '../utils';

const DashboardPage: NextPage<{ email: string }> = ({ email }) => {
  const router = useRouter();
  const [isLoding, setIsLoading] = useState(false); // エラーの有無

  const onLogout = async () => {
    setIsLoading(true);
    await logout(); // ログアウトさせる
    router.push('/login'); // ログインページへ遷移させる
  };

  return (
    <div className='h-100 p-5'>
      <Head>
        <title>Dashboard Page</title>
        <meta name='description' content='ダッシュボード画面です。' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='h-100 d-flex justify-content-center align-items-center'>
        <div className='card'>
          <h1 className='card-header fs-6'>Dashboard</h1>
          <div className='card-body'>
            <h2 className='fs-6'>email: {email}</h2>
            <div className='mt-3 text-center'>
              <button className='btn btn-primary' onClick={onLogout} disabled={isLoding}>
                <span className={isLoding ? 'd-none' : ''}>Logout</span>
                <span
                  className={'spinner-border spinner-border-sm ' + (isLoding ? '' : 'd-none')}
                  role='status'
                >
                  <span className='visually-hidden'>Loading...</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

DashboardPage.getInitialProps = async ({ req, res }) => {
  const isServerSide = typeof window === 'undefined';

  // バックエンドのみで動かす
  if (isServerSide && req && res) {
    const root = process.env.APP_URL;
    const options = { headers: { cookie: req.headers.cookie || '' } };

    const result = await fetch(`${root}/api/me`, options);
    const json = (await result.json()) as { user?: { email: string } };

    // 認証情報が無ければログイン画面へリダイレクトさせる
    if (!json.user) {
      res.writeHead(302, { Location: '/login' });
      res.end();
    }

    return { email: (json.user || {}).email || '' };
  }

  // フロントエンドのみで動かす
  if (!isServerSide) {
    const result = await fetch('/api/me'); // 認証情報を取得する
    const json = (await result.json()) as { user?: { email: string } };

    // 認証情報が無ければログイン画面へリダイレクトさせる
    if (!json.user) Router.push('/login');

    return { email: (json.user || {}).email || '' };
  }
  return { email: '' };
};

export default DashboardPage;
