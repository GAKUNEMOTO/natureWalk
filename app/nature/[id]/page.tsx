'use client';

import { useParams } from 'next/navigation';
import ClientPage from './clientpage';


const Page = () => {
  const params = useParams();
  const id = params.id as string;

  return <ClientPage params={{ id }} />;
};

export default Page;