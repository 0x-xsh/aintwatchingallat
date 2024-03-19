// src/pages/index.tsx
import dynamic from 'next/dynamic';

const DynamicHome = dynamic(() => import('../comp/home'), { ssr: false });

const HomePage: React.FC = () => {
  return <DynamicHome />;
};

export default HomePage;
