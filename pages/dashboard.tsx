import type { GetServerSideProps, NextPage } from 'next';

import { useRouter } from 'next/router';
// import nookies from 'nookies';

// import { firebaseAdmin } from '../firebaseAdmin'; // この後に実装するファイル
// import { logout } from '../utils'; // 上記で実装したファイル

const DashboardPage: NextPage<{ email: string }> = ({ email }) => {
  const router = useRouter();

  const onLogout = async () => {
    // await logout(); // ログアウトさせる
    router.push('/login'); // ログインページへ遷移させる
  };

  return (
    <div className='vh-100 d-flex justify-content-center align-items-center'>
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
  );
};

export default DashboardPage;
