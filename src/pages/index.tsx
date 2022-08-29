import type { NextPage } from 'next'

import { trpc } from '../utils/trpc'

const Home: NextPage = () => {
  const { data } = trpc.proxy.hello.useQuery({ text: 'あああ' })

  return (
    <div>
      <h1>Home</h1>
      <div>{data?.greeting}</div>
    </div>
  )
}

export default Home
