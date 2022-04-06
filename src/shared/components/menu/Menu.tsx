import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { useUserContext } from '../user/UserContext';
import { getAccountUrl, getContactUrl, getDashboardUrl, getPriceUrl, getSignInPageUrl, getWhatUrl } from '../../urls';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { SignInCommon } from '../user/SignInCommon';
import { Link } from '../common/Link';

const linkClassCommon = 'inline-flex items-center px-2 pt-1 border-b-2 text-sm font-medium';
const linkClass = `${linkClassCommon} border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700`;
const currentLinkClass = `${linkClassCommon} border-indigo-500 text-gray-900`;

const mobileLinkClassCommon = 'block pl-3 pr-4 py-2 border-l-4 text-base font-medium';
const mobileLinkClass = `${mobileLinkClassCommon} border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800`;
const mobileCurrentLinkClass = `${mobileLinkClassCommon} bg-indigo-50 border-indigo-500 text-indigo-700`;

export const Menu = (): JSX.Element => {
  const router = useRouter();
  const { user, signOut } = useUserContext();

  const onSignInPage = getSignInPageUrl().endsWith(router.route);

  const [showSignIn, setShowSignIn] = useState(false);

  const [open, setOpen] = useState(false);

  const pagesSection = router.pathname.startsWith('/mina-formular');
  const accountSection = router.pathname.startsWith('/mitt-konto');

  return (
    <>
      <nav className="bg-white shadow-sm" data-test="menu">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex h-16">
          <Link href="/" className="flex items-center cursor-pointer group">
            <svg
              viewBox="0 0 510 90"
              className="h-6 w-auto"
            >
              <path
                d="M33.829 54.204c-.159 0-.317.009-.476.012-.161-.003-.314-.012-.477-.012-16.769 0-30.556 5.347-32.194 20.374-.042.388-.08 3.678-.114 5.45 9.029 6.932 19.997 10.64 32.784 10.638 12.649 0 23.796-3.84 32.785-10.638-.03-1.772-.074-5.062-.114-5.45-1.638-15.027-15.424-20.374-32.194-20.374zm-.476-8.892c9.295 0 16.827-9.27 16.827-20.707 0-11.438-7.533-18.121-16.827-18.121-9.291 0-16.825 6.683-16.825 18.121.002 11.437 7.534 20.707 16.825 20.707zm48.463-29.03V.665h-5.904V16.28H60.3v5.902h15.613v15.614h5.904V22.183H97.43v-5.902H81.816v.001z"
                className="fill-current text-indigo-600 group-hover:text-indigo-500"
              />
              <path
                d="M170.513 74.031V66.91h-4.388v-20.8c0-9.23-5.982-14.53-16.695-14.53-8.034 0-12.877 3.419-15.612 8.091l5.185 4.673c2.051-3.248 5.014-5.641 9.914-5.641 5.812 0 8.49 2.963 8.49 7.977v3.476h-7.464c-11.567 0-17.72 4.273-17.72 12.478 0 7.465 4.843 12.365 13.39 12.365 6.097 0 10.541-2.735 12.136-7.92h.4c.57 4.102 2.962 6.951 7.52 6.951l4.844.001zm-22.393-5.64c-4.33 0-7.066-1.938-7.066-5.585v-1.481c0-3.59 2.963-5.584 9.06-5.584h7.294v5.983c0 4.102-3.99 6.666-9.288 6.666v.001zm39.6 5.64V46.282c0-4.9 4.502-7.18 9.06-7.18 5.3 0 7.807 3.248 7.807 9.744v25.185h8.661V47.707c0-10.2-5.014-16.126-13.447-16.126-6.382 0-9.915 3.362-11.681 7.806h-.4V32.55h-8.66v41.48l8.66.001zm46.269 0V46.168c0-4.786 4.273-7.065 8.547-7.065 5.128 0 7.578 3.19 7.578 9.63V74.03h8.718V46.168c0-4.786 4.046-7.065 8.433-7.065 5.3 0 7.692 3.247 7.692 9.63V74.03h8.661V47.707c0-10.2-4.843-16.126-13.048-16.126-6.724 0-11.054 3.818-12.536 8.49h-.228c-1.994-5.755-6.723-8.49-12.307-8.49-6.325 0-9.402 3.533-11.111 7.806h-.4V32.55h-8.66v41.48l8.661.001zm68.148-48.66c3.59 0 4.957-1.767 4.957-4.217v-1.425c0-2.507-1.367-4.273-4.957-4.273s-4.957 1.766-4.957 4.273v1.425c0 2.45 1.367 4.216 4.957 4.216v.001zm15.954 0c3.59 0 4.958-1.767 4.958-4.217v-1.425c0-2.507-1.368-4.273-4.958-4.273s-4.957 1.766-4.957 4.273v1.425c0 2.45 1.368 4.216 4.957 4.216v.001zm12.82 48.66V66.91h-4.387v-20.8c0-9.23-5.983-14.53-16.638-14.53-8.091 0-12.934 3.419-15.67 8.091l5.186 4.673c2.108-3.248 5.071-5.641 9.914-5.641 5.812 0 8.547 2.963 8.547 7.977v3.476h-7.521c-11.567 0-17.72 4.273-17.72 12.478 0 7.465 4.9 12.365 13.446 12.365 6.04 0 10.485-2.735 12.08-7.92h.4c.569 4.102 2.962 6.951 7.52 6.951l4.843.001zm-22.392-5.64c-4.33 0-7.009-1.938-7.009-5.585v-1.481c0-3.59 2.963-5.584 9.003-5.584h7.35v5.983c0 4.102-3.988 6.666-9.344 6.666v.001zm45.413 5.64V66.91h-5.755V15h-8.718v50.427c0 5.356 2.963 8.604 8.889 8.604h5.584zm43.532 0V66.91h-4.387v-20.8c0-9.23-5.983-14.53-16.695-14.53-8.034 0-12.878 3.419-15.613 8.091l5.186 4.673c2.05-3.248 5.014-5.641 9.914-5.641 5.812 0 8.49 2.963 8.49 7.977v3.476h-7.464c-11.567 0-17.721 4.273-17.721 12.478 0 7.465 4.843 12.365 13.39 12.365 6.097 0 10.542-2.735 12.137-7.92h.399c.57 4.102 2.963 6.951 7.521 6.951l4.843.001zm-22.393-5.64c-4.33 0-7.065-1.938-7.065-5.585v-1.481c0-3.59 2.963-5.584 9.06-5.584h7.293v5.983c0 4.102-3.989 6.666-9.288 6.666v.001zM412.165 75c3.875 0 5.812-2.336 5.812-5.413V68.39c0-3.134-1.937-5.47-5.812-5.47-3.931 0-5.869 2.336-5.869 5.47v1.197c0 3.077 1.938 5.413 5.87 5.413h-.001zm26.44-.969V46.282c0-4.9 4.5-7.18 9.059-7.18 5.3 0 7.806 3.248 7.806 9.744v25.185h8.661V47.707c0-10.2-5.014-16.126-13.447-16.126-6.382 0-9.915 3.362-11.681 7.806h-.399V32.55h-8.66v41.48l8.661.001zm62.734 0H510V32.55h-8.66V60.3c0 4.9-4.388 7.179-8.89 7.179-5.299 0-7.977-3.362-7.977-9.63v-25.3h-8.66v26.383c0 10.256 5.013 16.068 13.56 16.068 6.838 0 10.143-3.76 11.624-7.806h.342v6.837z"
                className="fill-current text-gray-900 group-hover:text-gray-700"
              />
            </svg>
          </Link>
          {user && (
            <>
              <div className="hidden sm:flex pl-6 sm:pl-12 -my-px space-x-6">
                <Link href={getDashboardUrl()} className={pagesSection ? currentLinkClass : linkClass}>
                  Mina formulär
                </Link>
                <Link href={getAccountUrl()} className={accountSection ? currentLinkClass : linkClass}>
                  Mitt konto
                </Link>
              </div>
              <div className="hidden sm:flex ml-auto items-center">
                <Button
                  type="secondary"
                  size="md"
                  onClick={() => signOut()}
                >
                  Logga ut
                </Button>
              </div>
            </>
          )}
          {!user && (
            <>
              <div className="hidden sm:flex pl-6 sm:pl-12 -my-px space-x-6">
                <Link href={getWhatUrl()} className={linkClass}>
                  Funktioner
                </Link>
                <Link href={getPriceUrl()} className={linkClass}>
                  Pris
                </Link>
                <Link href={getContactUrl()} className={linkClass}>
                  Kontakt
                </Link>
              </div>
              <div className="ml-auto flex items-center">
                <Button
                  type="secondary"
                  size="md"
                  onClick={() => setShowSignIn(true)}
                  disabled={onSignInPage}
                >
                  Logga in
                </Button>
              </div>
            </>
          )}
          {user && (
            <div className="-mr-2 ml-auto flex items-center sm:hidden">
              <button
                type="button"
                className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                onClick={() => setOpen(!open)}
              >
                <svg
                  className={`h-6 w-6 ${open ? 'hidden' : 'block'}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`h-6 w-6 ${!open ? 'hidden' : 'block'}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
        {open && user && (
          <div className="sm:hidden">
            <div className="py-2 space-y-2 border-b border-gray-200">
              <Link href="/mina-formular" className={pagesSection ? mobileCurrentLinkClass : mobileLinkClass}>
                Mina formulär
              </Link>
              <Link href="/mitt-konto" className={accountSection ? mobileCurrentLinkClass : mobileLinkClass}>
                Mitt konto
              </Link>
            </div>
            <div className="py-2">
              <a
                className={`${mobileLinkClass} cursor-pointer`}
                onClick={() => signOut()}
              >
                Logga ut
              </a>
            </div>
          </div>
        )}
        {open && !user && (
          <div className="sm:hidden">
            <div className="py-2">
              <a
                className={`${mobileLinkClass} cursor-pointer`}
                onClick={() => {
                  setShowSignIn(true);
                  setOpen(false);
                }}
              >
                Logga in
              </a>
            </div>
          </div>
        )}
      </nav>
      {!user && showSignIn && (
        <Modal
          onClose={() => setShowSignIn(false)}
        >
          <SignInCommon />
        </Modal>
      )}
    </>
  );
}
