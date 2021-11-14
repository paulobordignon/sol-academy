import { memo, useEffect, useState } from 'react';
import Image from 'next/image';
import b4hvector from '@/../public/images/b4h_vector.svg';
import { useTranslation } from 'next-i18next';
import { B4HButtonLanguage, B4HButtonTheme } from '@/components/atoms'
import { useTheme } from 'next-themes';
/* import { useAuth } from '@/hooks/useAuth'; */

import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import Web3Modal from 'web3modal';

export const B4HHeader: React.FC = memo(() => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const { t } = useTranslation('common');
  const { theme } = useTheme();
/*   const { signIn } = useAuth(); */
  const [account, setAccount] = useState();

  useEffect(() => {
    setMounted(true);
  }, [])

  function handleMenu() {
    setMenuOpen(!menuOpen);
  }

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: '27e484dcd9e3efcfd25a83a78777cdf1',
        chainId: 31,
        rpc: {
          31: 'https://public-node.testnet.rsk.co',
        },
      },
    },
  };

  const web3Modal = typeof window !== "undefined" && new Web3Modal({
    cacheProvider: false,
    providerOptions,
    theme: `${theme}`,
  });

  const provider = typeof window !== "undefined" && window.web3.currentProvider;

  async function signIn() {
    //@ts-ignore
    await web3Modal.connect()
      .then((res: any) => {
        if (res?.accounts?.length > 0) {
          setAccount(res.accounts[0]);
        } else {
          web3.eth.getAccounts().then(res => {
            if (res?.length > 0) {
              //@ts-ignore
              setAccount(res[0]);
            }
          });
        }
        return true;
      })
      .catch(() => {
        console.log('erro');
        return false;
      });
    return true;
  };

  const web3 = new Web3(provider);

  useEffect(() => {
    web3.eth.getAccounts(async function (err, accounts) {
       if (err != null) {
        console.log(err);
      }
      if (accounts?.length > 0) {
        //@ts-ignore
        await setAccount(accounts[0]);
      }
    });
  }, [account, web3]);
  
  if (!mounted) return null;

  return(
    <header className={`min-h-screen`}>
      <nav className="antialiased">
        <div className="w-full">
          <div className="flex flex-col max-w-screen-xl px-4 mx-auto md:items-center md:justify-end md:flex-row md:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <B4HButtonLanguage />
              <B4HButtonTheme />
            </div>
          </div>
          <div className="flex flex-col max-w-screen-xl px-4 mx-auto md:items-center md:justify-between md:flex-row md:px-6 lg:px-8">
            <div className="flex flex-row items-center justify-between p-4">
              <a href="/" className="text-lg font-semibold tracking-widest text-gray-900 uppercase rounded-lg dark:text-white focus:outline-none focus:shadow-outline">
                <Image
                  src={b4hvector}
                  width={55}
                  height={55}
                />
              </a>
              <button className="rounded-lg md:hidden focus:outline-none focus:shadow-outline" onClick={() => handleMenu()} >
                <svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
                  {menuOpen === false && 
                    <path d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"></path>
                  }
                  {menuOpen === true && 
                    <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path>    
                  }
                </svg>
              </button>
            </div>
            <nav className={`flex-col flex-grow ${menuOpen ? "flex" : "hidden"} pb-4 md:pb-0 md:flex md:justify-start md:flex-row`}>
              <a className="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark:bg-transparent dark:hover:bg-gray-600 dark:focus:bg-gray-600 dark:focus:text-white dark:hover:text-white dark:text-gray-200 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" href="#">{t`classes`}</a>
              <a className="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark:bg-transparent dark:hover:bg-gray-600 dark:focus:bg-gray-600 dark:focus:text-white dark:hover:text-white dark:text-gray-200 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" href="#">{t`profile`}</a> 
            </nav>
            <nav className={`flex-col flex-grow ${menuOpen ? "flex" : "hidden"} pb-4 md:pb-0 md:flex md:justify-end md:flex-row cursor-pointer`}>
              {account === undefined ? <a className="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark:bg-transparent dark:hover:bg-gray-600 dark:focus:bg-gray-600 dark:focus:text-white dark:hover:text-white dark:text-gray-200 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
              onClick={() => signIn()}>Login</a>
              : 
              <a className="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark:bg-transparent dark:hover:bg-gray-600 dark:focus:bg-gray-600 dark:focus:text-white dark:hover:text-white dark:text-gray-200 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
              onClick={() => {}}>Logado</a>
              }
            </nav>
          </div>
        </div>
      </nav>
    </header>
  )
})
