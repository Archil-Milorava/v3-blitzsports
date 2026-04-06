import { Accordion } from '@heroui/react'
import { Book, ChartBarStacked, ChevronDown, Newspaper, TabletSmartphone } from 'lucide-react'

const QASection = () => {
  const items = [
    {
      title: 'რატომ არ გაქვთ სხვა კატეგორიები?',
      icon: <ChartBarStacked size={20} />,
      content:
        'ამჟამად ვფოკუსირდებით მოცემულ კონტენტზე, მაგრამ გეგმაში გვაქვს სხვა კატეგორიების დამატება მომავალში.',
    },
    {
      title: 'წერთ თუ არა ქართულ სპორტზე?',
      icon: <Newspaper size={20} />,
      content:
        'დიახ, ჩვენი გუნდი რეგულარულად აქვეყნებს მიმოხილვებს ქართული სპორტის მოვლენებზე, განსაკუთრებით ძიუდოსა და ჭიდაობაზე.',
    },
    {
      title: 'ვინ წერს ისტორიებს და სიახლეებს?',
      icon: <Book size={20} />,
      content: 'ჩვენი კონტენტი იწერება პროფესიონალი სპორტული ჟურნალისტებისა და ექსპერტების მიერ.',
    },
    {
      title: 'გაქვთ თუ არა მობილური აპლიცაცია?',
      icon: <TabletSmartphone size={20} />,
      content:
        'ამჟამად ჩვენ ვმუშაობთ მობილური აპლიკაციის დეველოპმენტზე, რომელიც გამოვა მომავალი წლის დასაწყისში.',
    },
  ]

  return (
    <Accordion className="mt-14 w-full">
      {items.map((item, index) => (
        <Accordion.Item key={index}>
          <Accordion.Heading>
            <Accordion.Trigger>
              {item.icon ? (
                <span className="text-muted mr-4 size-4 shrink-0">{item.icon}</span>
              ) : null}
              {item.title}
              <Accordion.Indicator>
                <ChevronDown />
              </Accordion.Indicator>
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body>{item.content}</Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  )
}

export default QASection
