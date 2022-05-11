import { NextPage } from 'next';
import { useRouter } from 'next/router';
import type { FormEvent } from 'react';

import { useState } from 'react';

// import { login } from '../utils'; // 上記で実装したファイル

const LoginPage: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault(); // デフォルトの<form />の挙動を無効にする
    // await login(email, password); // email・passwordを使ってログイン
    router.push('/dashboard'); // ダッシュボードページへ遷移させる
  };

  return (
    <div className='vh-100 d-flex justify-content-center align-items-center'>
      <div className='card'>
        <h1 className='card-header fs-6'> Login</h1>

        <div className='card-body'>
          <form onSubmit={onSubmit}>
            <div>
              <label htmlFor='email'>Email</label>
              <input
                className='form-control'
                id='email'
                value={email}
                onInput={(e) => setEmail(e.currentTarget.value)}
              />
            </div>

            <div>
              <label htmlFor='password'>Password</label>

              <input
                id='password'
                type='password'
                className='form-control'
                value={password}
                onInput={(e) => setPassword(e.currentTarget.value)}
              />
            </div>
            <div className='mt-3 text-center'>
              <button className='btn btn-primary' type='submit'>
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
