import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Prose, withProse } from "@nikolovlazar/chakra-ui-prose";
import Layout from "../components/Layout";
import { ReactElement } from "react";
import { DefaultSeo } from "next-seo";
import posthog from "posthog-js";
import React from "react";
import { useRouter } from "next/router";
import { Lora } from "@next/font/google";

const lora = Lora({ subsets: ["latin"], display: "swap" });

const theme = extendTheme(
  {
    fonts: {
      heading: lora.style.fontFamily,
      body: lora.style.fontFamily,
    },
  },
  withProse({
    baseStyle: {
      "h1, h2, h3, h4, h5, h6": {
        mt: 4,
        mb: 4,
      },
      p: {
        my: 3,
      },
      a: {
        color: "blue.500",
      },
    },
  })
);

const getDefaultLayout = (page: ReactElement) => (
  <Layout>
    <Prose>{page}</Prose>
  </Layout>
);

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const getLayout = Component.getLayout || getDefaultLayout;

  React.useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_API_KEY || "", {
      api_host: "https://app.posthog.com",
    });

    const handleRouteChange = () => posthog.capture("$pageview");
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <DefaultSeo
        title="Adesh Kolte"
        description="I'm a constant learner,Cybersecurity professional and aspiring researcher. I'm also a Lead offensive Security engineer at Zokyo."
        openGraph={{
          title: "Adesh Kolte",
          description:
            "I'm a constant learner,Cybersecurity professional and aspiring technical researcher. I'm also a Lead offensive Security engineer at Zokyo.",
          images: [
            {
              url: "https://ad3.sh/og-image-dark.jpg",
              type: "image/jpeg",
            },
          ],
          siteName: "Adesh Kolte",
        }}
      />
      {getLayout(<Component {...pageProps} />)}
    </ChakraProvider>
  );
}
