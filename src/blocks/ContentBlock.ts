import { Block } from "payload";

export const ContentBlock: Block = {
  slug: "content",
  fields: [
    {
        name: "heading",
        type: "text",
        required: true,
    },
    {
      name: "content",
      type: "richText",
      required: true,
    },
  ],
};
