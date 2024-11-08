import { Tab, Tabs } from '@nextui-org/react';

type Props = {
  tabs: {
    title: string;
    content: React.ReactNode;
  }[];
};
export default function SimpleTabs({ tabs }: Props) {
  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Dinamic tabs" items={tabs}>
        {(item) => (
          <Tab
            key={item.title.toLowerCase().replace(' ', '_')}
            title={item.title}
          >
            {item.content}
          </Tab>
        )}
      </Tabs>
    </div>
  );
}
