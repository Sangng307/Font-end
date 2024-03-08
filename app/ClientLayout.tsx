"use client";

import { Layout } from "@components/layout";
import { BasketContextProvider } from "@context/basketContextProvider";
import { FoodContextProvider } from "@context/foodContextProvider";
import { Refine } from "@refinedev/core";
import Head from "next/head";
// import dataProvider from "@refinedev/simple-rest";
// import routerProvider from "@refinedev/nextjs-router/pages";
import { API_URL } from "src/constants";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <GitHubBanner /> */}
      <Refine
      // routerProvider={routerProvider}
      // dataProvider={dataProvider(API_URL)}
      >
        <Head>
          <title>Finefoods headless storefront example - refine</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
          />
          <link rel="icon" type="image/png" href="/favicon.ico" />
        </Head>
        <FoodContextProvider>
          <BasketContextProvider>
            <Layout>{children}</Layout>
          </BasketContextProvider>
        </FoodContextProvider>
      </Refine>
    </>
  );
}
