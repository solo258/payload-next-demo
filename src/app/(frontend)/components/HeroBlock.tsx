import { Page } from "@/payload-types";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Image from "next/image";
import Link from "next/link";

type HeroProps = Extract<Page["layout"][0], { blockType: "hero" }>

export default function HeroBlock({ block }: { block: HeroProps }) {
  return (
    <div
        style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "1px solid red",
            padding: "20px",
        }}
    >
      <h1>{block.heading}</h1>
      <RichText data={block.subheading} />
      { typeof block?.image === "object" && block.image.url && (
        <Image src={block.image.url} alt={block.image.alt} width={400} height={200} priority />
      )}
      <Link
       href={block.cta_button.url}
       style={{
        textDecoration: "none",
        backgroundColor: "blue",
        color: "white",
        padding: "10px 20px",
        borderRadius: "5px",
        display: "inline-block",
        marginTop: "20px",
       }}
       >
        {block.cta_button.label}
      </Link>
    </div>
  )
}

