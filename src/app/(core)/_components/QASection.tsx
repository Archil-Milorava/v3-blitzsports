import { Accordion } from '@heroui/react'
import { Book, ChartBarStacked, ChevronDown, Newspaper, TabletSmartphone } from 'lucide-react'

const QASection = () => {
  const items = [
    {
      title: 'რატომ არ გაქვთ სხვა კატეგორიები?',
      icon: <ChartBarStacked size={20} strokeWidth={2} aria-hidden />,
      content:
        'ამჟამად ვფოკუსირდებით მოცემულ კონტენტზე, მაგრამ გეგმაში გვაქვს სხვა კატეგორიების დამატება მომავალში.',
    },
    {
      title: 'წერთ თუ არა ქართულ სპორტზე?',
      icon: <Newspaper size={20} strokeWidth={2} aria-hidden />,
      content:
        'დიახ, ჩვენი გუნდი რეგულარულად აქვეყნებს მიმოხილვებს ქართული სპორტის მოვლენებზე, განსაკუთრებით ძიუდოსა და ჭიდაობაზე.',
    },
    {
      title: 'ვინ წერს ისტორიებს და სიახლეებს?',
      icon: <Book size={20} strokeWidth={2} aria-hidden />,
      content: 'ჩვენი კონტენტი იწერება პროფესიონალი სპორტული ჟურნალისტებისა და ექსპერტების მიერ.',
    },
    {
      title: 'გაქვთ თუ არა მობილური აპლიკაცია?',
      icon: <TabletSmartphone size={20} strokeWidth={2} aria-hidden />,
      content:
        'ამჟამად ჩვენ ვმუშაობთ მობილური აპლიკაციის დეველოპმენტზე, რომელიც გამოვა მომავალი წლის დასაწყისში.',
    },
  ]

  return (
    <section
      className="border-border bg-surface/80 mt-14 w-full rounded-2xl border px-4 py-8 sm:mt-16 sm:px-6 sm:py-10"
      aria-labelledby="landing-faq-heading"
    >
      <h2
        id="landing-faq-heading"
        className="text-foreground mb-2 text-center text-2xl font-bold tracking-tight sm:text-3xl"
      >
        ხშირად დასმული კითხვები
      </h2>
      <p className="text-muted mx-auto mb-8 max-w-2xl text-center text-sm leading-relaxed sm:text-base">
        მოკლედ იმაზე, თუ რას ვაკეთებთ და რა მოგვზავნია.
      </p>
      <Accordion className="mx-auto w-full max-w-3xl">
        {items.map((item, index) => (
          <Accordion.Item key={index} id={`faq-${index}`}>
            <Accordion.Heading>
              <Accordion.Trigger className="text-left">
                <span className="text-muted mr-3 flex size-9 shrink-0 items-center justify-center rounded-lg bg-default/80">
                  {item.icon}
                </span>
                <span className="text-foreground font-medium">{item.title}</span>
                <Accordion.Indicator>
                  <ChevronDown className="text-muted size-5 shrink-0" aria-hidden />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body className="text-muted pl-12 text-sm leading-relaxed sm:text-base">
                {item.content}
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </section>
  )
}

export default QASection
