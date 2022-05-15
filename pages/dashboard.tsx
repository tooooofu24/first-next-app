import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import nookies from 'nookies';
import { firebaseAdmin } from '../firebaseAdmin';
import { logout } from '../utils';

const DashboardPage: NextPage<{ email: string }> = ({ email }) => {
  const router = useRouter();

  const onLogout = async () => {
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
          <h1 className='card-header fs-6'>Dashboard Pages</h1>
          <div className='card-body'>
            <h2 className='fs-6'>email: {email}</h2>
            <div className='mt-3 text-center'>
              <button className='btn btn-primary' onClick={onLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx);
  const session = cookies.session || '';

  // セッションIDを検証して、認証情報を取得する
  const user = await firebaseAdmin
    .auth()
    .verifySessionCookie(session, true)
    .catch(() => null);

  // 認証情報が無い場合は、ログイン画面へ遷移させる
  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      email: user.email,
    },
  };
};

export default DashboardPage;
