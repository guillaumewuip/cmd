export default function Page() {
  return <div />
}

export async function getStaticProps() {
  return {
    redirect: {
      destination: 'posts/1',
      permanent: false,
    }
  }
}
