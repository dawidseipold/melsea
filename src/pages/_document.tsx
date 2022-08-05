import { Html, Head, Main, NextScript } from 'next/document';

const Document = () => {
  return (
    <Html>
      <Head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=switzer@2,101,600,701,800,501,601,900,100,700,901,400,201,401,200,300,301,801,500,1&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="bg-light-background-primary font-clashDisplay dark:bg-dark-background-primary">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
