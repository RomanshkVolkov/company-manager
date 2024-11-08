import MainWrapper from '@/app/ui/common/main-wrapper';

export default async function Page() {
  const promiseTestSuspense = async () => {
    setTimeout(() => {}, 5000);
  };

  await promiseTestSuspense();
  return (
    <MainWrapper title="Reportes">
      <div className="w-full"></div>
    </MainWrapper>
  );
}
