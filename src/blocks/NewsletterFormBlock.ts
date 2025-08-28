import { Block } from 'payload';

export const NewsletterFormBlock: Block = {
    slug: 'newsletter-form',
    fields: [
        {
          name: 'heading',
          type: 'text',
          required: false,
        },
        {
          name: 'form',
          type: 'relationship',
          relationTo: 'forms',
          required: true,
        },
    ],
};

 

